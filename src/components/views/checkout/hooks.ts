/*
 * FilePath    : blog-client-nuxt\src\components\views\checkout\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 结算 hooks
 */

import { computed, type ComputedRef, type Ref, ref } from "vue"

import { getCouponHasAvailableAPI } from "@/api/coupon/hasAvailable"
import { orderCouponApplyAPI, type OrderCouponApplyRequest, type OrderCouponApplyRes } from "@/api/order/couponApply"
import { generateEmptyResponse, getOrderCheckoutAPI, type OrderCheckoutRes } from "@/api/order/getCheckout"
import { getPayTypeOptionsWithEnable, PayType, TradeState } from "@/api/pay/common"
import { payOrderAPI, type PayOrderRequest } from "@/api/pay/order"
import { payQueryAPI, type PayQueryRequest } from "@/api/pay/query"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { useOptionsStore } from "@/stores/options"

// 订单结算相关逻辑
export function useOrderCheckout() {
    const optionsStore = useOptionsStore()

    const checkoutData: Ref<OrderCheckoutRes> = ref(generateEmptyResponse())
    const hasAvailableCoupons: Ref<boolean> = ref(false)
    const couponCodes = ref<string[]>([])
    const payTypeOptions = getPayTypeOptionsWithEnable(optionsStore.getPayTypeEnable)
    const payTypeResult = ref<PayType | null>(null) // 支付方式, 默认不选择, 由用户主动选择
    const totalAmount = ref(0)
    const discountAmount = ref(0)
    const isShowDiscount = ref(false)
    const finalAmount = ref(0)
    const detailsHeaderHeight = ref(40)
    const detailsHeight = ref("100px")
    const isPayQRCodeShow = ref(false)
    const isCouponBtnLoading = ref(false)
    const isPayBtnLoading = ref(false)
    const qrCodeUrl = ref("https://jiaopengzi.com")

    const isCouponBtnDisabled: ComputedRef<boolean> = computed(() => {
        // 当生成了支付二维码后, 优惠码按钮不可用
        return checkoutData.value.payment !== null || isCouponBtnLoading.value
    })

    const couponInputPlaceholder: ComputedRef<string> = computed(() => {
        // 当生成了支付二维码后, 优惠码输入框不可用
        return checkoutData.value.payment !== null ? "支付二维码已生成，无法修改优惠码" : "请输入优惠码, Enter 确认输入"
    })

    const getCheckout = async () => {
        const res = await getOrderCheckoutAPI()
        if (res.data.code === ResponseCode.GetOrderCheckoutSuccess) {
            const data = res.data.data
            checkoutData.value = data
            totalAmount.value = data.order.total_amount
            if (data.coupon) {
                discountAmount.value = data.coupon.discount_amount
                finalAmount.value = data.coupon.final_amount
                couponCodes.value = data.coupon.coupon_codes
                isShowDiscount.value = true
            } else {
                discountAmount.value = 0
                // 如果没有优惠券, 最终支付金额等于总金额
                finalAmount.value = data.order.total_amount
                isShowDiscount.value = false
            }
            if (data.payment) {
                payTypeResult.value = data.payment.pay_type
                qrCodeUrl.value = data.payment.pay_url
                isPayQRCodeShow.value = true
            }
            detailsHeight.value = `${Math.min(300, data.order.order_items.length * 40 + detailsHeaderHeight.value)}px` // 动态设置表格高度
        } else if (res.data.code === ResponseCode.GetOrderCheckoutNotFound) {
            const msg = handleResErr(res)
            MessageUtil.warning(msg)
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }
    }

    const checkHasAvailableCoupons = async () => {
        const res = await getCouponHasAvailableAPI()
        if (res.data.code === ResponseCode.CouponHasAvailableSuccess) {
            hasAvailableCoupons.value = res.data.data
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }
    }

    const couponApply = async () => {
        if (couponCodes.value.length === 0) {
            MessageUtil.warning("请输入优惠码")
            return
        }

        isCouponBtnLoading.value = true

        const requestData: OrderCouponApplyRequest = {
            id: checkoutData.value?.order.id || "",
            coupon_codes: couponCodes.value,
        }

        const res = await orderCouponApplyAPI(requestData)

        if (res.data.code === ResponseCode.OrderCouponApplySuccess) {
            const data: OrderCouponApplyRes = res.data.data
            checkoutData.value!.coupon = data
            totalAmount.value = data.total_amount
            discountAmount.value = data.discount_amount
            finalAmount.value = data.final_amount
            couponCodes.value = data.coupon_codes
            isShowDiscount.value = true

            // 保证有数据且包含 stream_items 字段才进行轮询
            if (data && data.stream_items) {
                await pollingGetStreamIDsStatus(data.stream_items)
            }

            MessageUtil.success("优惠码应用成功")
        } else {
            MessageUtil.error(handleResErr(res))
        }

        isCouponBtnLoading.value = false
    }

    const runCheckout = async () => {
        // 如果需要支付但未选择支付方式, 则提示用户
        if (finalAmount.value > 0 && !payTypeResult.value) {
            MessageUtil.warning("请选择支付方式")
            return
        }

        // 如果优惠券填写了但是没有应用, 则提示用户
        if (couponCodes.value.length > 0 && !checkoutData.value.coupon) {
            MessageUtil.warning("请先应用优惠码")
            return
        }

        // 如果最终支付金额为 0, 并且有回调地址, 则直接跳转
        if (checkoutData.value.order.return_url !== "" && checkoutData.value.coupon && checkoutData.value.coupon.final_amount === 0) {
            window.location.href = checkoutData.value.order.return_url
            return
        }

        isPayBtnLoading.value = true

        const req: PayOrderRequest = {
            is_re_pay: false, // 首次支付
            pay_type: payTypeResult.value as PayType, // 选择的支付方式 (已验证非空)
            order_id: checkoutData.value.order.id,
            description: checkoutData.value.order.description,
            return_url: checkoutData.value.order.return_url, // 支付完成后的回调地址
        }

        const res = await payOrderAPI(req)
        if (res.data.code === ResponseCode.PayOrderURLSuccess || res.data.code === ResponseCode.RePayOrderURLSuccess) {
            const data = res.data.data
            checkoutData.value.payment = data
            qrCodeUrl.value = data.pay_url
            isPayQRCodeShow.value = true
        } else if (res.data.code === ResponseCode.PayNewPayerError) {
            MessageUtil.error("支付遇到了一些问题，请稍后重试或联系网站管理员。")
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }

        isPayBtnLoading.value = false
    }

    /**
     * 轮询查询支付状态
     * @param orderID 订单 ID
     * @param payType 支付类型
     * @param pollingTime 轮询间隔时间, 默认 5 秒
     * @param timeOut 超时时间, 默认 5 分钟
     */
    async function pollingGetOrderStatus(orderID: string, payType: PayType, pollingTime: number = 5000, timeOut: number = 300000): Promise<void> {
        const startTime = Date.now()
        let isPaid = false

        while (Date.now() - startTime < timeOut && !isPaid && isPayQRCodeShow.value) {
            const req: PayQueryRequest = {
                order_id: orderID,
                pay_type: payType,
            }
            // eslint-disable-next-line no-await-in-loop
            const res = await payQueryAPI(req)
            const info = res.data

            if (info.code === ResponseCode.PayQuerySuccess) {
                if (info.data.pay_status === TradeState.Paid) {
                    isPayQRCodeShow.value = false
                    MessageUtil.success("支付成功")
                    const url = checkoutData.value.order.return_url
                    if (url) {
                        window.location.href = url
                    }
                    isPaid = true
                    break // 立即退出轮询
                }
                if (info.data.pay_status === TradeState.Unpaid) {
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise((resolve) => setTimeout(resolve, pollingTime))
                    continue
                }
            } else {
                MessageUtil.error(handleResErr(res))
                break // 出错时退出轮询
            }
        }
    }

    return {
        checkoutData,
        hasAvailableCoupons,
        couponCodes,
        payTypeOptions,
        payTypeResult,
        totalAmount,
        discountAmount,
        isShowDiscount,
        finalAmount,
        detailsHeaderHeight,
        detailsHeight,
        isPayQRCodeShow,
        isCouponBtnLoading,
        isCouponBtnDisabled,
        isPayBtnLoading,
        qrCodeUrl,
        couponInputPlaceholder,
        getCheckout,
        checkHasAvailableCoupons,
        couponApply,
        runCheckout,
        pollingGetOrderStatus,
    }
}
