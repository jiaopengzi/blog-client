/*
 * FilePath    : blog-client\src\views\admin\component\main\order\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单列表hook
 */

import { CouponDiscountType } from "@/api/coupon/common"
import { type CouponItemRes, type OrderItemRes, type PaymentRes, OrderStatusDisplay, OrderStatus } from "@/api/order/common"
import { PayType, PayTypeDisplay } from "@/api/pay/common"
import type { TableData } from "@/components/common/base-table"

// 获取评论统计数据
export function useOrder() {
    // 格式化订单子表
    const formatOrderItems = (row: TableData) => {
        if ("items" in row && row.items) {
            const items = row.items as OrderItemRes[]
            // 如果只有一个产品，则直接返回产品名称，否则返回产品名称和数量
            if (items.length === 1) {
                return items[0]!.title
            } else {
                return items.map((item) => `${item.title} (${item.quantity})`).join(", ")
            }
        }
    }

    // 格式化优惠券项
    const formatCouponItems = (row: TableData) => {
        if ("coupon_items" in row && row.coupon_items) {
            const items = row.coupon_items as CouponItemRes[]

            // 累加优惠金额
            const discount = items.reduce((total, item) => {
                if (item.discount_type === CouponDiscountType.FixedAmount) {
                    return total + item.amount
                } else if (item.discount_type === CouponDiscountType.Percentage) {
                    return total + (row.total_amount * item.amount) / 100 // 百分比折扣
                }
                return total
            }, 0)

            // 将折扣金额转换为元, 保留两位小数
            const formattedDiscount = (discount / 100).toFixed(2) // 转换
            return `${formattedDiscount} 元`
        }

        // 如果没有优惠券项，则返回 "-"
        return "-"
    }

    // 格式化支付方式
    const formatPayment = (row: TableData) => {
        if ("payment" in row && row.payment) {
            const payment = row.payment as PaymentRes
            return PayTypeDisplay[payment.pay_type as PayType] || "-" // 获取支付方式的显示名称
        }
        // 如果没有支付方式，则返回 "-"
        return "-"
    }

    // 格式化总金额（后端以分为单位）
    // 原注释等价移植：将 `total_amount` 转换为元并保留两位小数
    // 返回示例："123.45 元"；若无该字段则返回 undefined（与原行为一致）
    const formatTotalAmount = (row: TableData) => {
        if ("total_amount" in row) {
            return `${(row.total_amount / 100).toFixed(2)} 元`
        }
    }

    // 格式化订单状态
    // 将原 inline formatter 中的映射逻辑抽离：根据状态枚举获取显示文本
    const formatStatus = (row: TableData) => {
        if ("status" in row) {
            return OrderStatusDisplay[row.status as OrderStatus]
        }
    }

    // 格式化最终支付金额（后端以分为单位）
    const formatFinalAmount = (row: TableData) => {
        if ("payment" in row && row.payment && typeof (row.payment as PaymentRes).total_amount === "number") {
            const amt = (row.payment as PaymentRes).total_amount
            if (amt === 0) {
                return "-"
            }
            return `${(amt / 100).toFixed(2)} 元`
        }
        return "-"
    }

    return {
        formatOrderItems,
        formatCouponItems,
        formatPayment,
        formatFinalAmount,
        formatTotalAmount,
        formatStatus,
    }
}
