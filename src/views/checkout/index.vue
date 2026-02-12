<!--
 * FilePath    : blog-client\src\views\checkout\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 结算
-->

<template>
    <div class="checkout-page">
        <h1 class="title">订单结算</h1>

        <!-- 产品详情 -->
        <div class="product-details">
            <h4 class="title">产品详情</h4>
            <el-table :data="checkoutData.order.order_items" style="width: 100%" border stripe :height="detailsHeight">
                <el-table-column prop="title" label="产品" :width="titleWidth" />
                <el-table-column prop="price" label="价格" width="100" align="center">
                    <template #default="{ row }">{{ fenToYuan(row.price) }}元</template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" align="center" />
            </el-table>
        </div>

        <!-- 支付金额 -->
        <div class="payment">
            <p class="discount" v-if="isShowDiscount">
                订单金额<span class="total-number">{{ fenToYuan(totalAmount) }}</span
                >元，优惠金额<span class="discount-number">{{ fenToYuan(discountAmount) }}</span
                >元。
            </p>
            <p class="final-amount">
                支付<span class="final-number">{{ fenToYuan(finalAmount) }}</span
                >元。
            </p>
        </div>

        <!-- 优惠卷 -->
        <div v-if="hasAvailableCoupons" class="coupon">
            <h4 class="title">优惠卷码</h4>
            <div class="coupon-code">
                <el-input-tag
                    class="coupon-code-input"
                    v-model="couponCodes"
                    :trigger="trigger"
                    :placeholder="couponInputPlaceholder"
                    size="large"
                    :max="5"
                    clearable
                    :disabled="isCouponBtnDisabled"
                />
                <el-button :loading="isCouponBtnLoading" :disabled="isCouponBtnDisabled" class="coupon-code-btn" type="default" @click="couponApply"
                    >应用</el-button
                >
            </div>
        </div>

        <!-- 支付方式 -->
        <div class="pay-type" v-if="isShowPayType">
            <h4 class="title">选择支付方式</h4>
            <el-radio-group v-model="payTypeResult">
                <el-radio v-for="item in payTypeOptions" :key="item.value" :value="item.value">
                    <span class="pay-type-name">
                        {{ PayTypeDisplay[item.value] }}
                    </span>
                </el-radio>
            </el-radio-group>
        </div>

        <!-- 提交按钮 -->
        <el-button :loading="isPayBtnLoading" class="btn-submit" type="default" @click="runCheckout">{{ btnSubmitText }}</el-button>
    </div>

    <!-- 二维码 -->
    <el-dialog v-model="isPayQRCodeShow" width="370px" @close="handleClose">
        <PayQRCode v-if="isPayQRCodeShow" :qr-code-url="qrCodeUrl" :pay-type="payTypeResult" :amount="String(fenToYuan(finalAmount))" />
    </el-dialog>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { storeToRefs } from "pinia"
import { computed, onBeforeMount, ref, watch } from "vue"
import { useRouter } from "vue-router"

import { PayType, PayTypeDisplay } from "@/api/pay/common"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { fenToYuan } from "@/utils/amount"

import { useOrderCheckout } from "./hooks"
import PayQRCode from "@/components/common/pay-qr-code"

defineOptions({ name: RouteNames.Checkout })

useHead({
    title: "订单结算",
})

const router = useRouter()

// 设备类型
const deviceStore = useDeviceStore()

const { device } = storeToRefs(deviceStore)

// 输入触发方式
const trigger = ref<"Enter" | "Space">("Enter")

// 控制二维码弹窗显示
const handleClose = () => {
    isPayQRCodeShow.value = false
}

const {
    checkoutData,
    hasAvailableCoupons,
    couponCodes,
    payTypeOptions,
    payTypeResult,
    totalAmount,
    discountAmount,
    isShowDiscount,
    finalAmount,
    detailsHeight,
    isPayQRCodeShow,
    isCouponBtnLoading,
    isCouponBtnDisabled,
    isPayBtnLoading,
    qrCodeUrl,
    couponInputPlaceholder,
    getCheckout,
    checkHasAvailableCoupons,
    couponApply,
    runCheckout,
    pollingGetOrderStatus,
} = useOrderCheckout()

// 标题宽度
const titleWidth = computed(() => {
    switch (device.value) {
        case DeviceType.PC:
            return "400"
        case DeviceType.PAD:
            return "300"
        case DeviceType.PHONE:
            return "200"
        default:
            return "400"
    }
})

// 按钮文字
const btnSubmitText = computed(() => {
    if (finalAmount.value > 0) {
        return "立即支付"
    } else {
        return "完成订单"
    }
})

// 是否显示支付方式
const isShowPayType = computed(() => {
    if (finalAmount.value > 0) {
        return true
    } else {
        return false
    }
})

// 监听支付信息变化
watch(
    () => checkoutData.value.payment,
    async (newVal) => {
        if (newVal && newVal.order_id && newVal.pay_type !== PayType.Zero) {
            // 如果有支付信息，显示二维码
            isPayQRCodeShow.value = true
            // 计算过期时间用于轮训的超时时间
            const timeExpire = new Date(newVal.time_expire).getTime()
            const currentTime = Date.now()
            const timeOut = timeExpire - currentTime

            // 开始轮询获取订单状态
            await pollingGetOrderStatus(newVal.order_id, newVal.pay_type, 5000, timeOut)
        }
    },
)

onBeforeMount(async () => {
    // 获取结算数据
    await getCheckout()

    // 检查是否有可用的优惠卷
    await checkHasAvailableCoupons()

    // 如果数据为空直接跳转到首页
    if (!checkoutData.value.order.order_items.length) {
        router.push({ name: RouteNames.Home })
    }
})
</script>

<style lang="scss" scoped>
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

.payment {
    margin: 20px 0 40px 0;
    line-height: 1.5;

    .discount {
        font-size: 16px;
        color: var(--jpz-text-color-secondary);
        text-align: right;
        font-weight: 500;

        .total-number,
        .discount-number {
            margin: 0 5px;
        }
    }

    .final-amount {
        color: #c1401f;
        font-size: 18px;
        font-weight: 700;
        text-align: right;
        .final-number {
            margin: 0 5px;
            font-weight: 700;
            font-size: 24px;
        }
    }
}

.product-details,
.coupon,
.pay-amount {
    margin-bottom: 20px;
}

.pay-type {
    margin: 40px 0 20px 0;

    .pay-type-name {
        font-size: 14px;
        font-weight: 500;
        margin-top: 4px;
        color: var(--jpz-text-color-primary);
    }
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

@include respond-to("pc") {
    .checkout-page {
        margin-top: 68px;
        padding: 20px;
        width: 600px;
    }
}

@include respond-to("pad") {
    .checkout-page {
        margin-top: 68px;
        padding: 20px;
        width: 600px;
    }
}

@include respond-to("phone") {
    .checkout-page {
        width: 100%;
        padding: 10px;
        box-sizing: border-box; // 确保padding不影响宽度
    }
}
</style>
