<!--
 * FilePath    : blog-client\src\components\common\pay-key\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥
-->

<template>
    <!-- 注意挂载元素的样式不要和 #preview 的样式冲突重叠了 -->
    <div class="no-data" v-if="noData">暂无可购买的内容，请联系管理员。</div>
    <section class="account-key" v-if="!noData">
        <div class="account-key-title">{{ title }}</div>
        <div class="key-item" v-if="accountKeyProduct">
            <div class="title">{{ accountKeyProduct.title }}</div>
            <div class="price">价格：￥{{ fenToYuan(accountKeyProduct.price) }}</div>
            <div class="stock">库存：{{ accountKeyProduct.all_quantity - accountKeyProduct.sale_quantity }}</div>
        </div>
        <div class="description" v-if="description">{{ description }}</div>

        <div class="buy">
            <span class="buy-text">购买数量：</span>
            <el-input v-if="keyRes" class="input" type="number" :min="1" :max="quantityMax" v-model="quantity" placeholder="购买数量" />
            <el-button class="pay-key" :loading="loading" @click="handleClick(keyRes!)">立即购买</el-button>
        </div>
    </section>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue"

import type { AccountKeyRes } from "@/api/accountKey/common"
import { accountKeyGetProductAPI } from "@/api/accountKey/getProduct"
import { ProductType } from "@/api/order/common"
import { type Product as KeyRes } from "@/api/order/create"
import { ResponseCode } from "@/api/response"
import { fenToYuan } from "@/utils/amount"
import { MessageUtil } from "@/utils/message"

import { type PayKeyProps } from "./types"

defineOptions({ name: "PayKey" })

// 定义 props
const { productId, title = "账号密钥", description = "", loading = false } = defineProps<PayKeyProps>()

// 事件
const emit = defineEmits<{
    (event: "pay-key", val: KeyRes): void
}>()

// 产品信息
const accountKeyProduct = ref<AccountKeyRes | null>(null)

// 是否无数据
const noData = computed(() => {
    if (accountKeyProduct.value === null) return true
    return false
})

// 提交的反馈数据
const keyRes = computed<KeyRes | null>(() => {
    if (accountKeyProduct.value === null) return null
    return {
        product_type: ProductType.AccountKey,
        related_id: accountKeyProduct.value.related_id,
        quantity: "1",
    }
})

// 最大购买数量
const quantityMax = computed(() => {
    if (accountKeyProduct.value === null) return 1
    return accountKeyProduct.value.all_quantity - accountKeyProduct.value.sale_quantity
})

// 购买数量
const quantity = ref(1)

const handleClick = (key: KeyRes) => {
    // 库存不足
    if (quantityMax.value === 0) {
        MessageUtil.error("库存不足，无法购买")
        return
    }

    // 数量校验
    if (quantity.value < 1) {
        quantity.value = 1
    }
    if (quantity.value > quantityMax.value) {
        quantity.value = quantityMax.value
    }

    key.quantity = quantity.value.toString()

    emit("pay-key", key)
}

onBeforeMount(async () => {
    if (!productId) return
    const res = await accountKeyGetProductAPI({ id: productId })
    if (res.data.code === ResponseCode.AccountKeyGetProductSuccess) {
        accountKeyProduct.value = res.data.data
    }
})
</script>
<style scoped lang="scss">
.no-data {
    color: red;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    margin: 20px 0;
}

.account-key {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    position: relative;
    border: 1px dashed #c1401f; // 虚线边框
    border-radius: 10px;
    margin: 20px 0;
    padding: 20px;
    font-size: 14px;

    .account-key-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--jpz-text-color-primary);
        margin-bottom: 20px;
    }

    .key-item {
        // 网格布局，三列标题、价格、库存，其中标题自适应，价格和库存宽度固定
        display: grid;
        grid-template-columns: 3fr 2fr 1fr;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-bottom: 10px;
        background-color: var(--jpz-bg-color);
        // 展示下边框
        border-bottom: 1px solid var(--jpz-border-color);

        .title {
            font-weight: 600;
            text-align: left;
            color: var(--jpz-text-color-secondary);
        }

        .price {
            font-weight: 700;
            color: #c1401f;
        }

        .stock {
            color: var(--jpz-text-color-secondary);
        }
    }

    .description {
        color: var(--jpz-text-color-secondary);
        text-align: left;
    }

    .buy {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .buy-text {
            color: var(--jpz-text-color-secondary);
        }

        .input {
            width: 100px;
            margin-right: 10px;
        }

        .pay-key {
            background-color: #c1401f;
            color: #fff;
            border: none;

            &:hover {
                background-color: #a12e17;
            }

            &:active {
                background-color: #7d220f;
            }
        }
    }
}
</style>
