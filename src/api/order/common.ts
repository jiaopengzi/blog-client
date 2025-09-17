/*
 * FilePath    : blog-client\src\api\order\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单共用内容
 */

import { CouponDiscountType } from "@/api/coupon/common"
import { PayType, RefundStatus, TradeState } from "@/api/pay/common"
import { type User } from "@/api/user/getUserInfo"
import type { DataWithImg } from "@/components/common"

// 订单状态
export enum OrderStatus {
    AllStatus = 0, // 全部状态
    PendingPay = 1, // 待支付
    Processing = 2, // 处理中
    Shipped = 3, // 已发货
    InTransit = 4, // 运输中
    Delivered = 5, // 已送达
    Canceled = 6, // 已取消
    Returning = 7, // 退货中
    Returned = 8, // 已退货
    RefundedPartially = 9, // 部分退款
    RefundedAll = 10, // 全额退款
    Complete = 11, // 已完成
    Closed = 12, // 已关闭
}

// 订单状态显示
export const OrderStatusDisplay: Record<OrderStatus, string> = {
    [OrderStatus.AllStatus]: "全部",
    [OrderStatus.PendingPay]: "待支付",
    [OrderStatus.Processing]: "处理中",
    [OrderStatus.Shipped]: "已发货",
    [OrderStatus.InTransit]: "运输中",
    [OrderStatus.Delivered]: "已送达",
    [OrderStatus.Canceled]: "已取消",
    [OrderStatus.Returning]: "退货中",
    [OrderStatus.Returned]: "已退货",
    [OrderStatus.RefundedPartially]: "部分退款",
    [OrderStatus.RefundedAll]: "全额退款",
    [OrderStatus.Complete]: "已完成",
    [OrderStatus.Closed]: "已关闭",
}

// 获取订单状态选项
export const getOrderStatusOptions = () => {
    return Object.values(OrderStatus)
        .filter((value) => typeof value === "number")
        .map((value) => ({
            label: OrderStatusDisplay[value as OrderStatus],
            value: value as OrderStatus,
        }))
}

// 订单货币类型
export enum Currency {
    CNY = 1, // 1 人民币
    USD, // 2 美元
    EUR, // 3 欧元
    GBP, // 4 英镑
    HKD, // 5 港币
    TWD, // 6 台币
    SGD, // 7 新加坡元
    RUB, // 8 卢布
}

// 订单货币类型显示
export const CurrencyDisplay: Record<Currency, string> = {
    [Currency.CNY]: "人民币",
    [Currency.USD]: "美元",
    [Currency.EUR]: "欧元",
    [Currency.GBP]: "英镑",
    [Currency.HKD]: "港币",
    [Currency.TWD]: "台币",
    [Currency.SGD]: "新加坡元",
    [Currency.RUB]: "卢布",
}

// 获取订单货币类型选项
export const getCurrencyOptions = () => {
    return Object.values(Currency)
        .filter((value) => typeof value === "number")
        .map((value) => ({
            label: CurrencyDisplay[value as Currency],
            value: value as Currency,
        }))
}

// 产品类型
export enum ProductType {
    Post = "post", // 文章产品
    Membership = "membership", // 会员等级产品
    AccountKey = "account-key", // 账号密钥产品
}

// 产品类型显示
export const ProductTypeDisplay: Record<ProductType, string> = {
    [ProductType.Post]: "文章",
    [ProductType.Membership]: "会员升级",
    [ProductType.AccountKey]: "账号密钥",
}

// 获取产品类型选项
export const getProductTypeOptions = () => {
    return Object.values(ProductType).map((value) => ({
        label: ProductTypeDisplay[value as ProductType],
        value: value as ProductType,
    }))
}

// 订单子表响应
export interface OrderItemRes {
    order_id: string // 订单ID
    product_id: string // 产品ID
    product_type: ProductType // 产品类型
    title: string // 产品标题
    quantity: number // 数量
    price: number // 单价(分)
    description: string // 产品描述
}

// 优惠券子表响应
export interface CouponItemRes {
    order_id: string // 订单ID
    coupon_id: string // 优惠券ID
    code: string // 优惠券代码
    discount_type: CouponDiscountType // 折扣类型
    amount: number // 折扣数量
}

// 支付信息响应
export interface PaymentRes {
    order_id: string // 订单ID
    pay_type: PayType // 支付类型
    total_amount: number // 总金额(分)
    transaction_id: string // 交易ID
    trade_state: TradeState // 交易状态
}

// 退款信息响应
export interface RefundRes {
    order_id: string // 订单ID
    transaction_id: string // 交易ID
    refund_transaction_id: string // 退款交易ID
    total_amount: number // 订单总金额(分)
    refund_amount: number // 退款金额(分)
    status: RefundStatus // 退款状态
    reason: string // 退款原因
}

// 订单详情响应
export interface OrderGetByIDRes extends DataWithImg {
    id: string // 订单ID
    created_at: string // 创建时间
    updated_at: string // 更新时间
    status: OrderStatus // 订单状态
    currency: Currency // 货币类型
    total_amount: number // 总金额(分)
    user_id: string // 用户ID
    ip: string // 下单IP地址
    remark: string // 客户备注
    remark_admin: string // 管理员备注
    description: string // 描述
    items: OrderItemRes[] // 订单项
    coupon_items: CouponItemRes[] // 优惠券项
    payment: PaymentRes // 支付信息
    refund: RefundRes[] // 退款信息
    user_info: User // 用户信息
}
