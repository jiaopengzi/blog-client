<!--
 * @FilePath     : \blog-client\src\components\player\components\watermark\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 水印
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

// 定义props
const { textWatermark, logoWatermark } = defineProps<{
    textWatermark?: TextWatermark // 文字水印 可选
    logoWatermark?: LogoWatermark // logo 水印 可选
}>()

// 水印的 ref
const containerRef = useTemplateRef<HTMLElement | null>("containerRef")
const textWatermarkRef = shallowRef<HTMLSpanElement>()
const logoWatermarkRef = shallowRef<HTMLImageElement>()

//  定时器
let intervalId: ReturnType<typeof setInterval>

// 停止观察
const stopObservation = ref(false)

// 是否自动刷新水印
const isWatermarkAutoRefresh = ref(false)

// 是否显示文字水印
const isShowTextWatermark = computed(() => !!textWatermark?.content)

// 是否显示 logo 水印
const isShowLogoWatermark = computed(() => !!logoWatermark?.imgUrl)

// 获取文字水印内容
const textWatermarkContent = computed(() => textWatermark?.content || "")

// 获取 logo 水印地址
const logoWatermarkLogoSrc = computed(() => logoWatermark?.imgUrl || "")

// 获取文字水印的 z-index
// 水印位于 .video-container 内部, position: absolute; 其 z-index 仅在视频容器的层叠上下文中生效,
// 无需与全局固定定位元素 (如 el-overlay: 2000) 竞争, 默认值设为低值即可
const textWatermarkZindex = computed(() => textWatermark?.style?.zIndex || "2")

// 获取 logo 水印的 z-index
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
        // 首先设置基础样式
        Object.assign(watermark.style, style)

        // 确保定位属性存在
        if (!watermark.style.position) {
            watermark.style.position = "absolute"
        }

        // 获取容器的宽高
        const { clientWidth: containerWidth, clientHeight: containerHeight } = container

        // 使用 getBoundingClientRect 获取水印实际占用的宽高(考虑样式和渲染结果)
        const rect = watermark.getBoundingClientRect()
        const watermarkWidth = rect.width || watermark.clientWidth || watermark.offsetWidth || 0
        const watermarkHeight = rect.height || watermark.clientHeight || watermark.offsetHeight || 0

        // 可移动范围，保证水印不会超出容器
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

// 销毁水印
const destroyWatermark = (watermark: HTMLElement | undefined) => {
    if (watermark) {
        watermark.remove()
        watermark = undefined
    }
}

// 增加文字水印
const appendTextWatermark = () => {
    if (isShowTextWatermark.value) {
        stopObservation.value = true // 停止观察
        const el = document.createElement("span") // 创建 span 元素
        el.style.position = "absolute" // 设置绝对定位
        el.style.width = "max-content" // 设置宽度为内容宽度
        el.style.padding = "4px" // 设置内边距
        el.style.boxSizing = "border-box" // 设置 box-sizing, 防止 padding 导致宽度变化
        el.style.zIndex = textWatermarkZindex.value // 设置 z-index
        el.style.userSelect = "none" // 禁止选中
        el.innerText = textWatermarkContent.value // 设置水印内容
        containerRef.value?.appendChild(el) // 添加到容器中
        textWatermarkRef.value = el // 设置水印 ref

        // 设置水印样式
        if (textWatermark?.style) {
            setWatermarkStyle(textWatermarkRef.value, textWatermark.style, true)
            intervalId = setInterval(() => {
                if (textWatermarkRef.value && textWatermark?.style) {
                    // 设置自动刷新水印为 true
                    isWatermarkAutoRefresh.value = true

                    // 刷新水印
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

// 增加 logo 水印
const appendLogoWatermark = () => {
    if (isShowLogoWatermark.value) {
        stopObservation.value = true // 停止观察
        const el = document.createElement("img") // 创建 img 元素
        el.style.position = "absolute" // 设置绝对定位
        el.style.zIndex = logoWatermarkZindex.value // 设置 z-index
        el.style.userSelect = "none" // 禁止选中
        el.src = logoWatermarkLogoSrc.value // 设置图片地址
        containerRef.value?.appendChild(el) // 添加到容器中
        logoWatermarkRef.value = el // 设置水印 ref

        // 设置水印样式
        if (logoWatermark?.style) {
            setWatermarkStyle(logoWatermarkRef.value, logoWatermark.style, false)
        }

        // 异步设置停止观察为 false
        setTimeout(() => {
            stopObservation.value = false
        }, 0)
    }
}

// 是否重新渲染
const isReRendering = (mutation: MutationRecord, watermarkElement?: HTMLElement) => {
    let flag = false

    // 当水印被移除时，重新渲染水印
    if (mutation.removedNodes.length && watermarkElement) {
        flag = Array.from(mutation.removedNodes).includes(watermarkElement)
    }

    // 当 style 变化时，重新渲染水印, 排除自动刷新水印.
    if (mutation.type === "attributes" && mutation.target === watermarkElement && !isWatermarkAutoRefresh.value) {
        flag = true
    }

    return flag
}

// 重新渲染文字水印
const reRenderTextWatermark = () => {
    if (textWatermarkRef.value) {
        destroyWatermark(textWatermarkRef.value)
        appendTextWatermark()
    }
}

// 重新渲染 logo 水印
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
        // 判断是否需要重新渲染水印
        if (isReRendering(mutation, textWatermarkRef.value)) reRenderTextWatermark()
        if (isReRendering(mutation, logoWatermarkRef.value)) reRenderLogoWatermark()
    })
}

// 监听 DOM 变化
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

// 在组件卸载之前销毁水印 和 清除定时器
onBeforeUnmount(() => {
    destroyWatermark(textWatermarkRef.value)
    destroyWatermark(logoWatermarkRef.value)
    clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
.watermark-container {
    // position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
