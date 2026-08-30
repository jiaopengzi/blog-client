<!--
 * FilePath    : blog-client-nuxt\src\components\player\components\watermark\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 水印
-->

<template>
    <div class="watermark-container" ref="containerRef">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { useMutationObserver } from "@vueuse/core"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from "vue"

import type { LogoWatermark, TextWatermark } from "@/components/player/types"

defineOptions({ name: "VideoWatermark" })

const { textWatermark, logoWatermark } = defineProps<{
    textWatermark?: TextWatermark
    logoWatermark?: LogoWatermark
}>()

const containerRef = useTemplateRef<HTMLElement | null>("containerRef")
const textWatermarkRef = shallowRef<HTMLSpanElement>()
const logoWatermarkRef = shallowRef<HTMLImageElement>()

let intervalId: ReturnType<typeof setInterval>

const stopObservation = ref(false)

const isWatermarkAutoRefresh = ref(false)

const isShowTextWatermark = computed(() => !!textWatermark?.content)

const isShowLogoWatermark = computed(() => !!logoWatermark?.imgUrl)

const textWatermarkContent = computed(() => textWatermark?.content || "")

const logoWatermarkLogoSrc = computed(() => logoWatermark?.imgUrl || "")

// 水印位于 .video-container 内部, position: absolute; 其 z-index 仅在视频容器的层叠上下文中生效,
// 无需与全局固定定位元素 (如 el-overlay: 2000) 竞争, 默认值设为低值即可
const textWatermarkZindex = computed(() => textWatermark?.style?.zIndex || "2")

const logoWatermarkZindex = computed(() => logoWatermark?.style?.zIndex || "3")

/**
 * @description: 设置水印的样式
 * @param watermark 水印元素
 * @param style 水印样式
 * @param isRandomPosition 是否随机生成水印位置
 */
const setWatermarkStyle = (watermark: HTMLElement | undefined, style: Partial<CSSStyleDeclaration>, isRandomPosition: boolean) => {
    const container = containerRef.value

    if (container && watermark) {
        Object.assign(watermark.style, style)

        // 确保定位属性存在
        if (!watermark.style.position) {
            watermark.style.position = "absolute"
        }

        const { clientWidth: containerWidth, clientHeight: containerHeight } = container

        // 使用 getBoundingClientRect 获取水印实际占用的宽高(考虑样式和渲染结果)
        const rect = watermark.getBoundingClientRect()
        const watermarkWidth = rect.width || watermark.clientWidth || watermark.offsetWidth || 0
        const watermarkHeight = rect.height || watermark.clientHeight || watermark.offsetHeight || 0

        // 可移动范围, 保证水印不会超出容器
        const maxLeft = Math.max(0, containerWidth - watermarkWidth)
        const maxTop = Math.max(0, containerHeight - watermarkHeight)

        // 如果 isRandomPosition 为 true, 则随机生成水印的位置, 且考虑元素自身宽高
        if (isRandomPosition) {
            const left = Math.random() * maxLeft
            const top = Math.random() * maxTop
            style.left = `${left}px`
            style.top = `${top}px`

            // 再次设置样式主要是为了设置 left 和 top
            Object.assign(watermark.style, style)
        }
    }
}

const destroyWatermark = (watermark: HTMLElement | undefined) => {
    if (watermark) {
        watermark.remove()
        watermark = undefined
    }
}

const appendTextWatermark = () => {
    if (isShowTextWatermark.value) {
        stopObservation.value = true
        const el = document.createElement("span")
        el.style.position = "absolute"
        el.style.width = "max-content"
        el.style.padding = "4px"
        el.style.boxSizing = "border-box" // 防止 padding 导致宽度变化
        el.style.zIndex = textWatermarkZindex.value
        el.style.userSelect = "none"
        el.innerText = textWatermarkContent.value
        containerRef.value?.appendChild(el)
        textWatermarkRef.value = el

        if (textWatermark?.style) {
            setWatermarkStyle(textWatermarkRef.value, textWatermark.style, true)
            intervalId = setInterval(() => {
                if (textWatermarkRef.value && textWatermark?.style) {
                    isWatermarkAutoRefresh.value = true

                    setWatermarkStyle(textWatermarkRef.value, textWatermark.style, true)

                    // 异步设置自动刷新水印为 false
                    setTimeout(() => {
                        isWatermarkAutoRefresh.value = false
                    }, 0)
                }
            }, 5000)
        }

        // 异步设置停止观察为 false
        setTimeout(() => {
            stopObservation.value = false
        }, 0)
    }
}

const appendLogoWatermark = () => {
    if (isShowLogoWatermark.value) {
        stopObservation.value = true
        const el = document.createElement("img")
        el.style.position = "absolute"
        el.style.zIndex = logoWatermarkZindex.value
        el.style.userSelect = "none"
        el.src = logoWatermarkLogoSrc.value
        containerRef.value?.appendChild(el)
        logoWatermarkRef.value = el

        if (logoWatermark?.style) {
            setWatermarkStyle(logoWatermarkRef.value, logoWatermark.style, false)
        }

        // 异步设置停止观察为 false
        setTimeout(() => {
            stopObservation.value = false
        }, 0)
    }
}

const isReRendering = (mutation: MutationRecord, watermarkElement?: HTMLElement) => {
    let flag = false

    // 当水印被移除时, 重新渲染水印
    if (mutation.removedNodes.length && watermarkElement) {
        flag = Array.from(mutation.removedNodes).includes(watermarkElement)
    }

    // 当 style 变化时, 重新渲染水印, 排除自动刷新水印.
    if (mutation.type === "attributes" && mutation.target === watermarkElement && !isWatermarkAutoRefresh.value) {
        flag = true
    }

    return flag
}

const reRenderTextWatermark = () => {
    if (textWatermarkRef.value) {
        destroyWatermark(textWatermarkRef.value)
        appendTextWatermark()
    }
}

const reRenderLogoWatermark = () => {
    if (logoWatermarkRef.value) {
        destroyWatermark(logoWatermarkRef.value)
        appendLogoWatermark()
    }
}

// 当 DOM 变化时重新渲染水印
// 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
// https://github.com/element-plus/element-plus/blob/dev/packages/components/watermark/src/watermark.vue
const mutationCallback = (mutations: MutationRecord[]) => {
    if (stopObservation.value) {
        return
    }
    mutations.forEach((mutation) => {
        if (isReRendering(mutation, textWatermarkRef.value)) reRenderTextWatermark()
        if (isReRendering(mutation, logoWatermarkRef.value)) reRenderLogoWatermark()
    })
}

useMutationObserver(containerRef, mutationCallback, {
    attributes: true, // 监听属性变化
    subtree: true, // 监听后代节点
    childList: true, // 监听子节点的增加或删除
})

// 挂载时执行渲染水印
onMounted(() => {
    appendTextWatermark()
    appendLogoWatermark()
})

// 在组件卸载之前销毁水印和清除定时器
onBeforeUnmount(() => {
    destroyWatermark(textWatermarkRef.value)
    destroyWatermark(logoWatermarkRef.value)
    clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
.watermark-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
