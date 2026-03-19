<!--
 * FilePath    : blog-client\src\components\common\refund-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 退款列表
-->

<template>
    <div class="refund-details">
        <h4 class="title">退款</h4>
        <el-table :data="items" style="width: 100%" border stripe max-height="420" row-class-name="refund-details-row">
            <el-table-column prop="refund_transaction_id" label="退款交易ID" />
            <el-table-column prop="reason" label="退款原因" />
            <el-table-column prop="total_amount" label="已退款金额" align="center">
                <template #default="{ row }">{{ fenToYuan(row.refund_amount, true) }}</template>
            </el-table-column>
        </el-table>
        <p class="amount-info" v-if="isAllRefunded">
            支付总金额：<span class="amount">{{ fenToYuan(totalPaidAmount, true) }}</span
            >，已退款金额：<span class="refund">{{ fenToYuan(totalPaidAmount - computedFinal(totalPaidAmount, items), true) }}</span
            >，已全部退款。
        </p>

        <p class="amount-info" v-else>
            支付总金额：<span class="amount">{{ fenToYuan(totalPaidAmount, true) }}</span
            >，已退款金额：<span class="refund">{{ fenToYuan(totalPaidAmount - computedFinal(totalPaidAmount, items), true) }}</span
            >，剩余可退款金额：<span class="final-amount">{{ fenToYuan(computedFinal(totalPaidAmount, items), true) }}</span
            >。
        </p>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { type RefundRes } from "@/api/order/common"
import { fenToYuan } from "@/utils/amount"

defineOptions({ name: "RefundList" })

const { totalPaidAmount, items } = defineProps<{
    totalPaidAmount: number // 订单总金额
    items: RefundRes[]
}>()

// 计算优惠金额
const computedFinal = (total: number, couponList: RefundRes[]) => {
    if (couponList.length === 0) return total
    // 循环计算优惠金额
    const final = couponList.reduce((acc, item) => {
        return acc - (item.refund_amount || 0)
    }, total)

    // 如果最终金额小于0，则返回0
    return final < 0 ? 0 : final
}

const isAllRefunded = computed(() => {
    return computedFinal(totalPaidAmount, items) === 0
})
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

.refund-details {
    margin-bottom: 20px;
}

:deep(.el-table .el-table__cell) {
    vertical-align: top;
}

.amount-info {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.5;
    margin-top: 10px;

    .amount,
    .refund,
    .final-amount {
        margin: 0 5px;
        font-weight: 700;
    }
}

@include respond-to("phone") {
    :deep(.refund-details-row) {
        font-size: 13px;
    }
}
</style>
