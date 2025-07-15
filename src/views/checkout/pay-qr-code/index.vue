<!--
 * FilePath    : blog-client\src\views\checkout\pay-qr-code\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付二维码
-->
<template>
    <div class="container-pay-qr-code">
        <h1 class="title">支付二维码</h1>
        <p class="description">请使用手机扫描二维码进行支付</p>
        <div class="loader" v-if="isLoading && payType === PayType.Alipay"></div>
        <iframe class="qr-code" v-if="payType === PayType.Alipay" :src="qrCodeUrl" width="200" height="204" @load="onIframeLoaded"></iframe>
        <QrCode class="qr-code" v-if="payType === PayType.WechatPay" :options="{ data: qrCodeUrl, width: 200, height: 200 }" />

        <p class="final-amount">
            支付<span class="final-number">{{ amount }}</span
            >元
        </p>

        <div class="pay-type">
            <j-icon :name="payIconName(payType)" customClass="pay-icon" />
            <span class="pay-type-name">
                {{ PayTypeDisplay[payType] }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { PayType, PayTypeDisplay } from "@/api/pay/common"
import { IconKeys } from "@/components/common/icons"
import QrCode from "@/components/common/qr-code"

import type { PayQrCodeProps } from "./types"

defineOptions({ name: "PayQRCode" })
const { qrCodeUrl = "https://jiaopengzi.com", payType = PayType.WechatPay, amount = "99.00" } = defineProps<PayQrCodeProps>()

// 支付图标名称映射
const payIconName = (val: PayType) => {
    switch (val) {
        case PayType.WechatPay:
            return IconKeys.PayWechat
        case PayType.Alipay:
            return IconKeys.PayAlipay
        default:
            return IconKeys.PayWechat // 默认使用微信支付图标
    }
}

const isLoading = ref(true)
const onIframeLoaded = () => {
    isLoading.value = false
}
</script>

<style scoped lang="scss">
.container-pay-qr-code {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    width: 300px;
    height: 400px;
    // background-color: var(--jpz-bg-color-page);
    // border-radius: 16px;
}

.title {
    color: var(--jpz-text-color-primary);
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: 700;
}

.description {
    font-size: 18px;
    color: var(--jpz-text-color-secondary);
    margin-bottom: 20px;
    font-weight: 500;
}

.qr-code {
    margin-bottom: 10px;
}

.pay-type {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    :deep(.pay-icon) {
        font-size: 24px;
        margin-right: 6px;
    }

    .pay-type-name {
        font-size: 18px;
        color: var(--jpz-text-color-primary);
    }
}

.final-amount {
    color: #c1401f;
    font-size: 20px;
    font-weight: 700;
    .final-number {
        margin: 0 5px;
    }
}

/* 参考：https://css-loaders.com/classic/ */
// HTML: <div class="loader"></div>
.loader {
    margin: 40px auto;
    width: fit-content;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 30px;
    padding-bottom: 8px;
    background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
    animation: l2 2s linear infinite;
}
.loader:before {
    content: "加载中...";
}
@keyframes l2 {
    to {
        background-size: 100% 3px;
    }
}
</style>
