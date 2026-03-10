<!--
 * FilePath    : blog-client\src\components\common\qr-code\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 二维码组件
-->
<template>
    <div class="qr-code">
        <img ref="imgRef" :src="qrCodeUrl" v-if="qrCodeUrl" />
    </div>
</template>

<script lang="ts" setup>
import QRCodeStyling from "qr-code-styling"
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue"

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
const QR_CODE_RENDER_TIMEOUT = 1000 // 渲染超时
const QR_CODE_IMAGE_LOAD_TIMEOUT = 1000 // 图片加载超时
const isQrCodeCompleted = ref(false) // 是否二维码生成完成

// 图片加载超时后触发完成事件, 进入无 image 的兜底分支, 避免中心图片卡住导致二维码无法使用
let imageLoadTimer: number | undefined

// 默认配置
const defaultOptions: QRCodeOptions = {
    type: "svg",
    shape: "square",
    width: 100,
    height: 100,
    data: "https://jiaopengzi.com",
    margin: 0,
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "H" },
    // 注意 logo 遮挡的部分不能太大, 否则会导致二维码无法识别
    imageOptions: { saveAsBlob: true, hideBackgroundDots: true, imageSize: 0.4, margin: 1, crossOrigin: "anonymous" },
    dotsOptions: { type: "square", color: "#000000", roundSize: true, gradient: void 0 },
    backgroundOptions: { round: 0, color: "#ffffff00", gradient: void 0 },
    cornersSquareOptions: { type: "square", color: "#000000", gradient: void 0 },
    cornersDotOptions: { type: "square", color: "#000000" },
}

// 使用 props 传入的配置覆盖默认配置
const qrCodeOptions = computed(() => {
    return {
        ...defaultOptions,
        ...options,
    }
})

/**
 * 去掉二维码中心图片后返回新的配置.
 * 当带 image 的二维码在移动端卡住时, 通过移除 image 进行兜底.
 */
function createOptionsWithoutImage(option: QRCodeOptions): QRCodeOptions {
    const nextOptions = { ...option }
    delete nextOptions.image
    return nextOptions
}

/**
 * 释放旧的二维码图片 URL.
 * 避免多次重试生成时残留无用的 Blob URL.
 */
function revokeQrCodeUrl(): void {
    if (!qrCodeUrl.value) {
        return
    }

    URL.revokeObjectURL(qrCodeUrl.value)
    qrCodeUrl.value = ""
}

/**
 * 为异步二维码生成增加超时控制.
 * 超时后抛错, 让上层进入无 image 的兜底分支.
 */
function withTimeout<T>(promise: Promise<T>, timeout: number, message: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = window.setTimeout(() => {
            reject(new Error(message))
        }, timeout)

        promise
            .then((value) => {
                window.clearTimeout(timer)
                resolve(value)
            })
            .catch((error) => {
                window.clearTimeout(timer)
                reject(error)
            })
    })
}

/**
 * 触发二维码完成事件.
 * 确保在正常 onload, 图片失败或超时兜底时都只触发一次.
 */
function completeQrCode(): void {
    if (isQrCodeCompleted.value) {
        return
    }

    isQrCodeCompleted.value = true
    if (imageLoadTimer) {
        window.clearTimeout(imageLoadTimer)
        imageLoadTimer = void 0
    }
    emit("qr-code-complete")
}

/**
 * 使用指定配置生成二维码图片 URL.
 * 每次尝试都创建新实例, 避免前一次卡住的实例影响后续兜底.
 */
async function generateQrCodeUrl(option: QRCodeOptions): Promise<string> {
    const instance = new QRCodeStyling(option)
    const data = await withTimeout(instance.getRawData("svg"), QR_CODE_RENDER_TIMEOUT, "qr code render timeout")
    return URL.createObjectURL(data as Blob)
}

/**
 * 生成二维码图片 URL.
 * 先尝试使用完整配置生成, 如果因为中心图片卡住或失败, 则自动移除 image 重试.
 */
async function renderQrCodeUrl(): Promise<void> {
    isQrCodeCompleted.value = false
    revokeQrCodeUrl()

    const primaryOptions = qrCodeOptions.value

    try {
        qrCodeUrl.value = await generateQrCodeUrl(primaryOptions)
    } catch {
        const fallbackOptions = createOptionsWithoutImage(primaryOptions)

        try {
            qrCodeUrl.value = await generateQrCodeUrl(fallbackOptions)
        } catch {
            completeQrCode()
        }
    }
}

onMounted(() => {
    renderQrCodeUrl()
})

onBeforeUnmount(() => {
    revokeQrCodeUrl()
    if (imageLoadTimer) {
        window.clearTimeout(imageLoadTimer)
        imageLoadTimer = void 0
    }
})

// 图片加载完成后触发事件, 进入正常流程
watch(
    () => imgRef.value,
    async (newVal) => {
        if (newVal && newVal.complete) {
            completeQrCode()
            return
        }

        if (newVal && imgRef.value) {
            if (imageLoadTimer) {
                window.clearTimeout(imageLoadTimer)
            }

            imgRef.value.onload = () => {
                completeQrCode()
            }

            imgRef.value.onerror = () => {
                completeQrCode()
            }

            imageLoadTimer = window.setTimeout(() => {
                completeQrCode()
            }, QR_CODE_IMAGE_LOAD_TIMEOUT)
        }
    },
    { deep: true, flush: "post" },
)
</script>
<style scoped lang="scss">
.qr-code {
    background-color: #ffffff;
}
</style>
