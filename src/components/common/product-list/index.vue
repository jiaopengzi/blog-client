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
            <el-table-column prop="title" label="产品">
                <template #default="{ row }">
                    <div class="product-title-wrap">
                        <div class="product-title">{{ row.title }}</div>
                        <div class="product-type" v-if="row.product_type">{{ getProductTypeLabel(row) }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" align="center">
                <template #default="{ row }">{{ fenToYuan(row.price, true) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center" />
            <el-table-column v-if="shouldShowDetailColumn" prop="description" label="产品明细" min-width="260">
                <template #default="{ row }">
                    <div class="product-detail-cell">
                        <div class="product-description" v-if="row.description">{{ row.description }}</div>
                        <div class="account-key-items" v-if="hasAccountKeyItems(row)">
                            <div class="account-key-title">卡密内容</div>
                            <ul class="account-key-list">
                                <li v-for="(item, index) in row.account_key_items" :key="`${row.product_id}-${index}`">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <span class="product-empty" v-if="!row.description && !hasAccountKeyItems(row)">暂无明细</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import { ProductTypeDisplay, type OrderItemRes } from "@/api/order/common"
import { fenToYuan } from "@/utils/amount"

defineOptions({ name: "ProductList" })

const { items } = defineProps<{
    items: OrderItemRes[]
}>()

// 产品详情表头高度
const detailsHeaderHeight = ref(40)

// 产品详情表格高度, 最多 300px
const detailsHeight = computed(() => {
    return `${Math.min(420, items.length * 72 + detailsHeaderHeight.value)}px`
})

const shouldShowDetailColumn = computed(() => {
    return items.some((item) => Boolean(item.description) || hasAccountKeyItems(item))
})

const hasAccountKeyItems = (item: OrderItemRes) => {
    return Array.isArray(item.account_key_items) && item.account_key_items.length > 0
}

const getProductTypeLabel = (item: OrderItemRes) => {
    return ProductTypeDisplay[item.product_type]
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

.product-details {
    margin-bottom: 20px;
}

.product-title-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .product-title {
        color: var(--jpz-text-color-primary);
        font-weight: 600;
    }

    .product-type {
        color: var(--jpz-text-color-secondary);
        font-size: 12px;
    }
}

.product-detail-cell {
    display: flex;
    flex-direction: column;
    gap: 8px;
    white-space: normal;
    word-break: break-all;

    .product-description {
        color: var(--jpz-text-color-secondary);
        line-height: 1.6;
    }

    .account-key-items {
        padding: 10px 12px;
        border-radius: 8px;
        background: var(--jpz-bg-color-page);
        text-align: left;

        .account-key-title {
            color: var(--jpz-text-color-primary);
            font-weight: 600;
            margin-bottom: 6px;
        }

        .account-key-list {
            margin: 0;
            padding-left: 18px;
            color: var(--jpz-text-color-secondary);

            li + li {
                margin-top: 6px;
            }
        }
    }

    .product-empty {
        color: var(--jpz-text-color-disabled);
    }
}

@include respond-to("phone") {
    :deep(.product-details-row) {
        font-size: 13px;
    }
}
</style>
