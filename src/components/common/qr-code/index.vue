<!--
 * FilePath    : blog-client\src\components\common\qr-code\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 二维码组件
-->
<template>
    <img ref="imgRef" :src="qrCodeUrl" v-if="qrCodeUrl" />
</template>

<script lang="ts" setup>
import QRCodeStyling from "qr-code-styling"
import { computed, onMounted, ref, useTemplateRef, watch } from "vue"

import type { QRCodeOptions } from "./types"

defineOptions({ name: "QrCode" })

const { options = {} } = defineProps<{
    options?: QRCodeOptions
}>()

// 事件
const emit = defineEmits<{
    (event: "qr-code-complete"): void // 二维码渲染完成
}>()

const imgRef = useTemplateRef<HTMLImageElement>("imgRef")

const qrCodeUrl = ref("")

// 默认配置
const defaultOptions: QRCodeOptions = {
    type: "svg",
    shape: "square",
    width: 100,
    height: 100,
    data: "https://jiaopengzi.com",
    margin: 0,
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "M" },
    image: "https://image.jiaopengzi.com/blog/uploads/logo/logo-108.ico",
    imageOptions: { saveAsBlob: true, hideBackgroundDots: true, imageSize: 1, margin: 1, crossOrigin: "anonymous" },
    dotsOptions: { type: "square", color: "#333333", roundSize: true, gradient: void 0 },
    backgroundOptions: { round: 0, color: "#ffffff00", gradient: void 0 },
    cornersSquareOptions: { type: "square", color: "#333333", gradient: void 0 },
    cornersDotOptions: { type: "square", color: "#333333" },
}

// 使用 props 传入的配置覆盖默认配置
const qrCodeOptions = computed(() => {
    return {
        ...defaultOptions,
        ...options,
    }
})

// 创建二维码实例
const qrCode = new QRCodeStyling(qrCodeOptions.value)

onMounted(() => {
    qrCode.update(qrCodeOptions.value)
    qrCode.getRawData("svg").then((data) => {
        qrCodeUrl.value = URL.createObjectURL(data as Blob)
    })

    // 移除URL对象，避免内存泄漏
    URL.revokeObjectURL(qrCodeUrl.value)
})

watch(
    () => imgRef.value,
    async (newVal) => {
        if (newVal && newVal.complete) {
            emit("qr-code-complete")
            return
        }

        if (newVal && imgRef.value) {
            imgRef.value.onload = () => {
                emit("qr-code-complete")
            }
        }
    },
    { deep: true, flush: "post" },
)
</script>
