<!--
 * FilePath    : blog-client\src\components\common\product-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 产品详情
-->

<template>
    <!-- 产品详情 -->
    <div class="product-details">
        <h4 class="title">产品详情</h4>
        <el-table :data="items" style="width: 100%" border stripe :max-height="detailsHeight" row-class-name="product-details-row">
            <el-table-column prop="title" label="产品" />
            <el-table-column prop="price" label="价格" align="center">
                <template #default="{ row }">{{ fenToYuan(row.price, true) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center" />
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import { type OrderItemRes } from "@/api/order/common"
import { fenToYuan } from "@/utils/amount"

defineOptions({ name: "ProductList" })

const { items } = defineProps<{
    items: OrderItemRes[]
}>()

// 产品详情表头高度
const detailsHeaderHeight = ref(40)

// 产品详情表格高度, 最多 300px
const detailsHeight = computed(() => {
    return `${Math.min(300, items.length * 40 + detailsHeaderHeight.value)}px`
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

.product-details {
    margin-bottom: 20px;
}

@include respond-to("phone") {
    :deep(.product-details-row) {
        font-size: 13px;
    }
}
</style>
