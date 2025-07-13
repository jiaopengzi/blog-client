/*
 * FilePath    : blog-client\src\views\checkout\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 结算hooks
 */

import { reactive, type Ref, ref } from "vue"

import { orderCouponApplyAPI, type OrderCouponApplyRequest, type OrderCouponApplyRes } from "@/api/order/couponApply"
import { getOrderCheckoutAPI, type OrderCheckoutRes } from "@/api/order/getCheckout"
import { getPayTypeOptions, PayType, PayTypeDisplay } from "@/api/pay/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

// 表单验证
export function useOrderCheckout() {
    const checkoutData: Ref<OrderCheckoutRes | null> = ref(null) // 结算数据
    const couponCodes = ref<string[]>([]) // 优惠码
    const payTypeOptions = getPayTypeOptions() // 支付方式选项
    const payTypeResult = ref<PayType>(PayType.WechatPay) // 默认支付方式
    const payAmount = ref(0) // 支付金额
    const detailsHeaderHeight = ref(40) // 产品详情表头高度
    const detailsHeight = ref("100px") // 产品详情表格高度

    const getCheckout = async () => {
        const res = await getOrderCheckoutAPI()
        if (res.data.code === ResponseCode.GetOrderCheckoutSuccess) {
            const data = res.data.data
            checkoutData.value = data
            payAmount.value = data.order.total_amount // 更新支付金额
            detailsHeight.value = `${Math.min(300, data.order.order_items.length * 40 + detailsHeaderHeight.value)}px` // 动态设置表格高度
        } else if (res.data.code === ResponseCode.GetOrderCheckoutNotFound) {
            checkoutData.value = null
            const msg = handleResErr(res)
            MessageUtil.warning(msg)
        } else {
            checkoutData.value = null
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }
    }

    const couponApply = async () => {
        // 检查优惠码是否为空
        if (couponCodes.value.length === 0) {
            MessageUtil.warning("请输入优惠码")
            return
        }
        // 调用API检查优惠码
        const requestData: OrderCouponApplyRequest = {
            id: checkoutData.value?.order.id || "",
            coupon_codes: couponCodes.value,
        }
        const res = await orderCouponApplyAPI(requestData)
        if (res.data.code === ResponseCode.OrderCouponApplySuccess) {
            const data: OrderCouponApplyRes = res.data.data
            checkoutData.value!.coupon = data // 更新结算数据中的优惠券信息
            payAmount.value = data.final_amount // 更新支付金额
            MessageUtil.success("优惠码应用成功")
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }

        // 得到最终的支付金额
    }

    const runCheckout = async () => {}

    return {
        checkoutData,
        couponCodes,
        payTypeOptions,
        payTypeResult,
        payAmount,
        detailsHeight,
        getCheckout,
        couponApply,
        runCheckout,
    }
}
