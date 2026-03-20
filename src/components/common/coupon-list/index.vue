<!--
 * FilePath    : blog-client\src\components\common\coupon-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠券列表
-->

<template>
    <!-- 产品详情 -->
    <div class="coupon-details">
        <h4 class="title">优惠券</h4>
        <el-table :data="items" style="width: 100%" border stripe max-height="420" row-class-name="coupon-details-row">
            <el-table-column prop="code" label="优惠券" />
            <el-table-column prop="amount" label="优惠金额" align="center">
                <template #default="{ row }">{{ fenToYuan(computedDiscount(totalAmount, row.discount_type, row.amount), true) }}</template>
            </el-table-column>
            <el-table-column prop="discount_type" label="优惠方式" align="center">
                <template #default="{ row }">{{ CouponDiscountTypeDisplay[row.discount_type as CouponDiscountType] }}</template>
            </el-table-column>
        </el-table>
        <p class="amount-info">
            订单总金额：<span class="amount">{{ fenToYuan(totalAmount, true) }}</span
            >，优惠金额：<span class="discount">{{ fenToYuan(totalAmount - computedFinal(totalAmount, items), true) }}</span
            >，最终支付金额：<span class="final-amount">{{ fenToYuan(computedFinal(totalAmount, items), true) }}</span>
        </p>
    </div>
</template>

<script lang="ts" setup>
import { CouponDiscountType, CouponDiscountTypeDisplay } from "@/api/coupon/common"
import { type CouponItemRes } from "@/api/order/common"
import { fenToYuan } from "@/utils/amount"

defineOptions({ name: "CouponList" })

const { totalAmount, items } = defineProps<{
    totalAmount: number // 订单总金额
    items: CouponItemRes[]
}>()

// 计算优惠金额
const computedDiscount = (total: number, discountType: CouponDiscountType, amount: number) => {
    switch (discountType) {
        case CouponDiscountType.FixedAmount:
            return amount
        case CouponDiscountType.Percentage:
            return (total * amount) / 100
        default:
            return 0
    }
}

// 计算优惠金额
const computedFinal = (total: number, couponList: CouponItemRes[]) => {
    if (couponList.length === 0) return total
    // 循环计算优惠金额
    const final = couponList.reduce((acc, item) => {
        return acc - computedDiscount(total, item.discount_type, item.amount)
    }, total)

    // 如果最终金额小于0，则返回0
    return final < 0 ? 0 : final
}
</script>

<style lang="scss" scoped>
h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}

.title {
    color: var(--jpz-text-color-primary);
}

.coupon-details {
    margin-bottom: 20px;
}

:deep(.el-table .el-table__cell) {
    vertical-align: top;
}

.amount-info {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.5;
    // text-align: right;
    margin-top: 10px;

    .amount,
    .discount,
    .final-amount {
        margin: 0 5px;
        font-weight: 700;
    }
}

@include respond-to("phone") {
    :deep(.coupon-details-row) {
        font-size: 13px;
    }
}
</style>
