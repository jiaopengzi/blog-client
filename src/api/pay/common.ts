/*
 * FilePath    : blog-client\src\api\pay\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付共用内容
 */

// 支付方式
export enum PayType {
    Alipay = "alipay", // 支付宝
    WechatPay = "wechat_pay", // 微信支付
}

// 支付方式显示
export const PayTypeDisplay: Record<PayType, string> = {
    [PayType.Alipay]: "支付宝",
    [PayType.WechatPay]: "微信支付",
}

// 支付方式选项
export const getPayTypeOptions = () => [
    { label: PayTypeDisplay[PayType.Alipay], value: PayType.Alipay },
    { label: PayTypeDisplay[PayType.WechatPay], value: PayType.WechatPay },
]

// 支付状态
export enum TradeState {
    Unpaid = "unpaid", // 未支付
    Paid = "paid", // 已支付
    Refunded = "refunded", // 已退款
    Closed = "closed", // 已关闭
}

// 支付状态显示
export const TradeStateDisplay: Record<TradeState, string> = {
    [TradeState.Unpaid]: "未支付",
    [TradeState.Paid]: "已支付",
    [TradeState.Refunded]: "已退款",
    [TradeState.Closed]: "已关闭",
}

// 支付状态选项
export const getTradeStateOptions = () => {
    return Object.values(TradeState).map((value) => ({
        label: TradeStateDisplay[value as TradeState],
        value: value as TradeState,
    }))
}

// 退款状态
export enum RefundStatus {
    Pending = "pending", // 待处理
    Processing = "processing", // 退款处理中
    Success = "success", // 退款成功
    Closed = "closed", // 退款关闭
    Failed = "failed", // 退款失败
}

// 退款状态显示
export const RefundStatusDisplay: Record<RefundStatus, string> = {
    [RefundStatus.Pending]: "待处理",
    [RefundStatus.Processing]: "退款处理中",
    [RefundStatus.Success]: "退款成功",
    [RefundStatus.Closed]: "退款关闭",
    [RefundStatus.Failed]: "退款失败",
}

// 退款状态选项
export const getRefundStatusOptions = () => {
    return Object.values(RefundStatus).map((value) => ({
        label: RefundStatusDisplay[value as RefundStatus],
        value: value as RefundStatus,
    }))
}
