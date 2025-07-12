<!--
 * FilePath    : blog-client\src\views\checkout\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 结算
-->

<template>
    <div class="checkout-container">
        <div class="checkout-page">
            <h1 class="title">订单结算</h1>

            <!-- 产品详情 -->
            <div class="product-details">
                <h4 class="title">产品详情</h4>
                <el-table :data="checkoutData?.order_items" style="width: 100%" border stripe :height="detailsHeight">
                    <el-table-column prop="title" label="产品" width="400" />
                    <el-table-column prop="price" label="价格" width="100" align="center" />
                    <el-table-column prop="quantity" label="数量" align="center" />
                </el-table>
            </div>

            <!-- 支付金额 -->
            <div class="pay-amount">
                <h4 class="title amount">
                    合计支付：<span class="amount-number">{{ payAmount }}</span>
                </h4>
            </div>

            <!-- 优惠卷 -->
            <div class="coupon">
                <h4 class="title">优惠卷码</h4>
                <div class="coupon-code">
                    <el-input-tag
                        class="coupon-code-input"
                        v-model="couponCodes"
                        :trigger="trigger"
                        placeholder="请输入优惠码, Enter 确认输入"
                        size="large"
                        :max="100"
                        clearable
                    />
                    <el-button class="coupon-code-btn" type="default" @click="checkoutCoupon">应用</el-button>
                </div>
            </div>

            <!-- 支付方式 -->
            <div class="pay-type">
                <h4 class="title">选择支付方式</h4>
                <el-radio-group v-model="payTypeResult">
                    <el-radio v-for="item in payTypeOptions" :key="item.value" :value="item.value">
                        {{ PayTypeDisplay[item.value] }}
                    </el-radio>
                </el-radio-group>
            </div>

            <!-- 提交按钮 -->
            <el-button class="btn-submit" type="default" @click="runCheckout">立即支付</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { h, onBeforeMount, reactive, ref, toRefs, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { PayTypeDisplay } from "@/api/pay/common"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

import { useOrderCheckout } from "./hooks"
import type { ViewForm } from "./types"

defineOptions({ name: RouteNames.Checkout })

useHead({
    title: "订单结算",
})

// props
const { viewData } = defineProps<{
    viewData: ViewForm // 展示信息
}>()

// emits
const emit = defineEmits<{
    (event: "submit-data", value: ViewForm): void // 提交数据
}>()

const trigger = ref<"Enter" | "Space">("Enter") // 输入触发方式

const { checkoutData, couponCodes, payTypeOptions, payTypeResult, payAmount, detailsHeight, getCheckout, checkoutCoupon, runCheckout } = useOrderCheckout()

onBeforeMount(async () => {
    await getCheckout()
})
</script>

<style lang="scss" scoped>
.checkout-page {
    margin-top: 68px;
    padding: 20px;
    width: 600px;

    h1 {
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 20px;
    }
    h4 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .title {
        color: var(--jpz-text-color-primary);
    }

    .amount {
        font-size: 20px;
        font-weight: 700;
        text-align: right;
        color: #c1401f;
        margin-right: 20px;
    }

    .amount-number {
        font-size: 24px;
        font-weight: 700;
    }

    .product-details,
    .coupon,
    .pay-type,
    .pay-amount {
        margin-bottom: 20px;
    }

    .pay-type {
        margin-top: 40px;
    }

    .coupon-code {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .coupon-code-input {
            flex: 1;
            margin-right: 10px;
            height: 40px;
            font-size: 16px;
            font-weight: 700;
        }

        .coupon-code-btn {
            width: 80px;
            height: 40px;
            font-size: 16px;
        }
    }

    .btn-submit {
        margin-top: 20px;
        font-size: 24px;
        background-color: #188838;
        color: #ffffff;
        text-align: center;
        width: 100%;
        font-weight: 700;
        height: 60px;
        border-radius: 8px;
        border: none;
        &:hover {
            background-color: #166f2e;
        }
        &:active {
            background-color: #145c24;
        }
    }
}

@include respond-to("pc") {
}

@include respond-to("pad") {
}

@include respond-to("phone") {
}
</style>
