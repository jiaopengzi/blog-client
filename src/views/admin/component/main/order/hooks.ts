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

// 格式化总金额（后端以分为单位）
// 原注释等价移植：将 `total_amount` 转换为元并保留两位小数
// 返回示例："123.45 元"；若无该字段则返回 undefined（与原行为一致）
const formatTotalAmount = (row: TableData) => {
    if ("total_amount" in row) {
        return `${(row.total_amount / 100).toFixed(2)} 元`
    }
}

/**
 * @description: 格式化订单商品信息.
 * @param row 表格行数据.
 * @return 商品标题字符串.
 */
const formatOrderItems = (row: TableData) => {
    if ("items" in row && row.items) {
        const items = row.items as OrderItemRes[]
        if (items.length === 1) {
            return items[0]!.title
        }
        return items.map((item) => `${item.title} (${item.quantity})`).join(", ")
    }
}

/**
 * @description: 格式化优惠券抵扣金额.
 * @param row 表格行数据.
 * @return 抵扣金额字符串.
 */
const formatCouponItems = (row: TableData) => {
    if ("coupon_items" in row && row.coupon_items) {
        const items = row.coupon_items as CouponItemRes[]
        const discount = items.reduce((total, item) => {
            if (item.discount_type === CouponDiscountType.FixedAmount) {
                return total + item.amount
            } else if (item.discount_type === CouponDiscountType.Percentage) {
                return total + (row.total_amount * item.amount) / 100
            }
            return total
        }, 0)

        return `${(discount / 100).toFixed(2)} 元`
    }

    return "-"
}

/**
 * @description: 格式化支付方式显示文本.
 * @param row 表格行数据.
 * @return 支付方式名称.
 */
const formatPayment = (row: TableData) => {
    if ("payment" in row && row.payment) {
        const payment = row.payment as PaymentRes
        return PayTypeDisplay[payment.pay_type as PayType] || "-"
    }
    return "-"
}

/**
 * @description: 格式化订单状态显示文本.
 * @param row 表格行数据.
 * @return 订单状态文本.
 */
const formatStatus = (row: TableData) => {
    if ("status" in row) {
        return OrderStatusDisplay[row.status as OrderStatus]
    }
}

/**
 * @description: 格式化最终支付金额.
 * @param row 表格行数据.
 * @return 最终支付金额字符串.
 */
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

// 获取评论统计数据
export function useOrder() {
    return {
        formatOrderItems,
        formatCouponItems,
        formatPayment,
        formatFinalAmount,
        formatTotalAmount,
        formatStatus,
    }
}
