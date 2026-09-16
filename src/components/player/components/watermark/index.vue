<!--
 * FilePath    : blog-client\src\components\player\components\watermark\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 水印 (响应水印内容变化重渲染; 随机定位等待容器布局就绪)
-->

<template>
    <div class="watermark-container" ref="containerRef">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { useMutationObserver } from "@vueuse/core"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from "vue"

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
 * @returns 随机定位模式下返回是否已定位; 容器尺寸未就绪 (宽或高 <= 0) 时返回 false 且不写入定位值,
 *          避免随机结果恒为左上角 (0,0) 并污染共享的 style 对象; 非随机模式恒返回 true
 */
const setWatermarkStyle = (watermark: HTMLElement | undefined, style: Partial<CSSStyleDeclaration>, isRandomPosition: boolean): boolean => {
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
            // 容器尺寸未就绪 (Nuxt 水合早期 CSS/布局未应用) 时随机结果恒为 (0,0), 交由调用方重试
            if (containerWidth <= 0 || containerHeight <= 0) {
                return false
            }

            const left = Math.random() * maxLeft
            const top = Math.random() * maxTop
            style.left = `${left}px`
            style.top = `${top}px`

            // 再次设置样式主要是为了设置 left 和 top
            Object.assign(watermark.style, style)
        }
    }

    return true
}

// 随机定位重试帧数上限, 约 1s (60 帧); 超过后由 5s 定时器兜底重定位
const RANDOM_POSITION_RETRY_FRAMES = 60

/**
 * @description: 容器尺寸未就绪时的随机定位重试.
 * Nuxt 水合早期页面 CSS 尚未应用, 容器测量为 0x0, 随机定位会退化为左上角 (0,0),
 * 用 rAF 等待布局就绪后再定位; 水印被重渲染替换或已移出 DOM 后停止重试.
 * @param watermark 水印元素
 * @param style 水印样式
 * @param retries 剩余重试帧数
 */
const randomPositionWhenReady = (watermark: HTMLElement | undefined, style: Partial<CSSStyleDeclaration>, retries: number) => {
    // 水印已被重渲染替换或已销毁, 放弃本次重试
    if (!watermark || !watermark.isConnected || textWatermarkRef.value !== watermark) return

    // 标记自动刷新, 避免 MutationObserver 把程序自身的定位写入当作外部篡改而触发重建 (与 5s 定时器路径同构)
    isWatermarkAutoRefresh.value = true
    const positioned = setWatermarkStyle(watermark, style, true)
    if (positioned) {
        // 定位完成前水印处于隐藏态, 恢复显示使首次可见即为随机位置
        watermark.style.visibility = ""
    }
    setTimeout(() => {
        isWatermarkAutoRefresh.value = false
    }, 0)
    if (positioned) return
    if (retries <= 0) return

    requestAnimationFrame(() => randomPositionWhenReady(watermark, style, retries - 1))
}

const destroyWatermark = (watermark: HTMLElement | undefined) => {
    if (watermark) {
        watermark.remove()
        watermark = undefined
    }
}

const appendTextWatermark = () => {
    if (isShowTextWatermark.value) {
        // 重渲染路径 (destroy 后再次 append) 会重新创建随机位置定时器, 先清理旧的避免叠加泄漏
        clearInterval(intervalId)
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
            // 容器尺寸未就绪时 setWatermarkStyle 不定位, 由 rAF 重试等到布局就绪 (bugfix 260916-07: 刷新后水印恒在左上角)
            if (!setWatermarkStyle(textWatermarkRef.value, textWatermark.style, true)) {
                // 定位完成前先隐藏, 避免水印以无定位的静态位置 (近似左上角) 短暂可见
                if (textWatermarkRef.value) {
                    textWatermarkRef.value.style.visibility = "hidden"
                }
                randomPositionWhenReady(textWatermarkRef.value, textWatermark.style, RANDOM_POSITION_RETRY_FRAMES)
            }
            intervalId = setInterval(() => {
                if (textWatermarkRef.value && textWatermark?.style) {
                    isWatermarkAutoRefresh.value = true

                    // 定位成功的兜底路径同时负责恢复隐藏态 (rAF 重试上限耗尽时由此接手)
                    if (setWatermarkStyle(textWatermarkRef.value, textWatermark.style, true)) {
                        textWatermarkRef.value.style.visibility = ""
                    }

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

/**
 * @description: 销毁文字水印并复位引用, 用于内容变空的场景.
 * 与 reRenderTextWatermark 的区别: 不再重新 append, 且必须清空 textWatermarkRef,
 * 否则 MutationObserver 会因水印被移除而将其复活.
 */
const removeTextWatermark = () => {
    stopObservation.value = true
    clearInterval(intervalId)
    destroyWatermark(textWatermarkRef.value)
    textWatermarkRef.value = undefined
    setTimeout(() => {
        stopObservation.value = false
    }, 0)
}

/**
 * @description: 销毁 logo 水印并复位引用, 用于地址变空的场景.
 */
const removeLogoWatermark = () => {
    stopObservation.value = true
    destroyWatermark(logoWatermarkRef.value)
    logoWatermarkRef.value = undefined
    setTimeout(() => {
        stopObservation.value = false
    }, 0)
}

// 监听文字水印内容变化, 重新渲染水印 (bugfix 260916-07 bug01)
// 场景: Nuxt 客户端 stores 延迟到 onNuxtReady 后初始化 (init-stores.client.ts 的 hydration 决策),
// 视频先以默认水印挂载, 登录态恢复后 content 才变为用户名, 必须重渲染才能显示登录态水印;
// 旧 SPA 为纯 CSR, store 在视频挂载前就绪, 无此问题时序
watch(textWatermarkContent, (newVal, oldVal) => {
    if (newVal === oldVal) return

    if (!newVal) {
        removeTextWatermark()
        return
    }

    if (textWatermarkRef.value) {
        reRenderTextWatermark()
    } else {
        appendTextWatermark()
    }
})

// 监听 logo 水印地址变化, 重新渲染水印 (时序场景同文字水印)
watch(logoWatermarkLogoSrc, (newVal, oldVal) => {
    if (newVal === oldVal) return

    if (!newVal) {
        removeLogoWatermark()
        return
    }

    if (logoWatermarkRef.value) {
        reRenderLogoWatermark()
    } else {
        appendLogoWatermark()
    }
})

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
