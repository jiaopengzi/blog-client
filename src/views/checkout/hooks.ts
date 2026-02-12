/*
 * FilePath    : blog-client\src\views\checkout\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 结算hooks
 */

import { computed, type ComputedRef, type Ref, ref } from "vue"

import { getCouponHasAvailableAPI } from "@/api/coupon/hasAvailable"
import { orderCouponApplyAPI, type OrderCouponApplyRequest, type OrderCouponApplyRes } from "@/api/order/couponApply"
import { generateEmptyResponse, getOrderCheckoutAPI, type OrderCheckoutRes } from "@/api/order/getCheckout"
import { getPayTypeOptions, PayType, TradeState } from "@/api/pay/common"
import { payOrderAPI, type PayOrderRequest } from "@/api/pay/order"
import { payQueryAPI, type PayQueryRequest } from "@/api/pay/query"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

// 表单验证
export function useOrderCheckout() {
    const checkoutData: Ref<OrderCheckoutRes> = ref(generateEmptyResponse()) // 结算数据
    const hasAvailableCoupons: Ref<boolean> = ref(false) // 是否有可用的优惠卷
    const couponCodes = ref<string[]>([]) // 优惠码
    const payTypeOptions = getPayTypeOptions() // 支付方式选项
    const payTypeResult = ref<PayType>(PayType.WechatPay) // 默认支付方式
    const totalAmount = ref(0) // 订单总金额
    const discountAmount = ref(0) // 优惠金额
    const isShowDiscount = ref(false) // 是否显示优惠金额
    const finalAmount = ref(0) // 最终支付金额
    const detailsHeaderHeight = ref(40) // 产品详情表头高度
    const detailsHeight = ref("100px") // 产品详情表格高度
    const isPayQRCodeShow = ref(false) // 二维码对话框是否可见
    const isCouponBtnLoading = ref(false) // 优惠卷按钮加载状态
    const isPayBtnLoading = ref(false) // 支付按钮加载状态
    const qrCodeUrl = ref("https://jiaopengzi.com") // 二维码图片URL

    // 优惠卷按钮是否可用
    const isCouponBtnDisabled: ComputedRef<boolean> = computed(() => {
        // 当生成了支付二维码后，优惠码按钮不可用
        return checkoutData.value.payment !== null || isCouponBtnLoading.value
    })

    // 优惠码输入框的占位符
    const couponInputPlaceholder: ComputedRef<string> = computed(() => {
        // 当生成了支付二维码后，优惠码输入框不可用
        return checkoutData.value.payment !== null ? "支付二维码已生成，无法修改优惠码" : "请输入优惠码, Enter 确认输入"
    })

    // 获取结算数据
    const getCheckout = async () => {
        const res = await getOrderCheckoutAPI()
        if (res.data.code === ResponseCode.GetOrderCheckoutSuccess) {
            const data = res.data.data
            checkoutData.value = data
            totalAmount.value = data.order.total_amount // 订单总金额
            if (data.coupon) {
                discountAmount.value = data.coupon.discount_amount // 更新优惠金额
                finalAmount.value = data.coupon.final_amount // 更新最终支付金额
                couponCodes.value = data.coupon.coupon_codes // 更新优惠码列表
                isShowDiscount.value = true // 显示优惠金额
            } else {
                discountAmount.value = 0
                finalAmount.value = data.order.total_amount // 如果没有优惠券，最终支付金额等于总金额
                isShowDiscount.value = false // 不显示优惠金额
            }
            if (data.payment) {
                payTypeResult.value = data.payment.pay_type // 设置支付类型
                qrCodeUrl.value = data.payment.pay_url // 设置二维码链接
                isPayQRCodeShow.value = true // 显示二维码对话框
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

    // 检查是否有可用的优惠卷
    const checkHasAvailableCoupons = async () => {
        const res = await getCouponHasAvailableAPI()
        if (res.data.code === ResponseCode.CouponHasAvailableSuccess) {
            hasAvailableCoupons.value = res.data.data
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }
    }

    // 应用优惠码
    const couponApply = async () => {
        // 检查优惠码是否为空
        if (couponCodes.value.length === 0) {
            MessageUtil.warning("请输入优惠码")
            return
        }

        // 设置优惠码按钮为加载状态
        isCouponBtnLoading.value = true

        // 调用API检查优惠码
        const requestData: OrderCouponApplyRequest = {
            id: checkoutData.value?.order.id || "",
            coupon_codes: couponCodes.value,
        }

        const res = await orderCouponApplyAPI(requestData)

        if (res.data.code === ResponseCode.OrderCouponApplySuccess) {
            const data: OrderCouponApplyRes = res.data.data
            checkoutData.value!.coupon = data // 更新结算数据中的优惠券信息
            totalAmount.value = data.total_amount // 更新总金额
            discountAmount.value = data.discount_amount // 更新优惠金额
            finalAmount.value = data.final_amount // 更新最终支付金额
            couponCodes.value = data.coupon_codes // 更新优惠码列表
            isShowDiscount.value = true // 显示优惠金额

            // 保证有数据且包含 stream_items 字段才进行轮询
            if (data && data.stream_items) {
                await pollingGetStreamIDsStatus(data.stream_items)
            }

            MessageUtil.success("优惠码应用成功")
        } else {
            MessageUtil.error(handleResErr(res))
        }

        isCouponBtnLoading.value = false // 重置优惠码按钮状态
    }

    // 执行支付
    const runCheckout = async () => {
        // 如果优惠卷填写了但是没有应用，则提示用户
        if (couponCodes.value.length > 0 && !checkoutData.value.coupon) {
            MessageUtil.warning("请先应用优惠码")
            return
        }

        // 如果最终支付金额为0，并且有回调地址，则直接跳转
        if (checkoutData.value.order.return_url !== "" && checkoutData.value.coupon && checkoutData.value.coupon.final_amount === 0) {
            window.location.href = checkoutData.value.order.return_url
            return
        }

        // 设置支付按钮为加载状态
        isPayBtnLoading.value = true

        // 构建支付请求数据
        const req: PayOrderRequest = {
            is_re_pay: false, // 首次支付
            pay_type: payTypeResult.value, // 选择的支付方式
            order_id: checkoutData.value.order.id, // 订单ID
            description: checkoutData.value.order.description, // 支付描述
            return_url: checkoutData.value.order.return_url, // 支付完成后的回调地址
        }

        // 调用支付API
        const res = await payOrderAPI(req)
        if (res.data.code === ResponseCode.PayOrderURLSuccess || res.data.code === ResponseCode.RePayOrderURLSuccess) {
            const data = res.data.data
            checkoutData.value.payment = data // 更新结算数据中的支付信息
            qrCodeUrl.value = data.pay_url // 设置二维码链接
            isPayQRCodeShow.value = true // 显示二维码对话框
        } else if (res.data.code === ResponseCode.PayNewPayerError) {
            MessageUtil.error("支付遇到了一些问题，请稍后重试或联系网站管理员。")
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }

        isPayBtnLoading.value = false // 重置支付按钮状态
    }

    /**
     * 轮询查询支付状态
     * @param orderID 订单ID
     * @param payType 支付类型
     * @param pollingTime 轮询间隔时间，默认5秒
     * @param timeOut 超时时间，默认5分钟
     * @returns Promise<TradeState | null> 支付状态，或超时/异常时为null
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
