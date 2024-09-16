<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-15 15:11:14
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-16 17:56:41
 * @FilePath     : \blog-client\src\components\player\components\watermark\index.vue
 * @Description  : 水印
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div>
        <template v-if="isShowTextWatermark">
            <i ref="textWatermarkRef" class="watermark text-watermark">{{ textWatermarkContent }}</i>
        </template>
        <template v-if="isShowLogoWatermark">
            <img ref="logoWatermarkRef" class="watermark logo-watermark" :src="logoWatermarkLogoSrc" />
        </template>
    </div>
</template>

<script setup lang="ts">

import { useTemplateRef, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { TextWatermark, LogoWatermark } from '@/stores/player'
import { parsePosition, type Position } from '@/utils/parser'

defineOptions({ name: 'VideoWatermark' })

// 定义props
const props = defineProps<{
    container: HTMLElement | null
    textWatermark?: TextWatermark // 文字水印 可选
    logoWatermark?: LogoWatermark // logo 水印 可选
}>()

// 水印的 ref
const textWatermarkRef = useTemplateRef<HTMLElement | null>("textWatermarkRef")
const logoWatermarkRef = useTemplateRef<HTMLElement | null>("logoWatermarkRef")

// 检查是否是文字水印
const isShowTextWatermark = computed(() => props.textWatermark?.content)

// 检查是否是 logo 水印
const isShowLogoWatermark = computed(() => props.logoWatermark?.imgUrl)


// 获取文字水印内容
const textWatermarkContent = computed(() => props.textWatermark?.content || '')

// 获取 logo 水印 logo
const logoWatermarkLogoSrc = computed(() => props.logoWatermark?.imgUrl || '')



/**
 * @description: 设置水印的样式
 * @param watermark 水印元素
 * @param style 水印样式
 * @param isRandomPosition 是否随机生成水印位置,默认为 false
 */
const setWatermarkStyle = (watermark: HTMLElement | null, style: Partial<CSSStyleDeclaration>, isRandomPosition: boolean) => {
    const container = props.container

    if (container && watermark) {

        // 首先设置基础样式
        Object.assign(watermark.style, style)


        // 获取容器的宽高
        const { clientWidth: containerWidth, clientHeight: containerHeight } = container

        // 获取水印的宽高
        const { clientWidth: watermarkWidth, clientHeight: watermarkHeight } = watermark

        // 获取容器的 Left 和 Top
        const { left: containerLeft, top: containerTop } = container.getBoundingClientRect()

        const width = containerWidth - watermarkWidth
        const height = containerHeight - watermarkHeight

        // 如果 isRandomPosition 为 true,则随机生成水印的位置
        if (isRandomPosition) {
            style.left = `${containerLeft + Math.random() * width}px`
            style.top = `${containerTop + Math.random() * height}px`
        } else {

            // 获取水印的 left 和 top
            const { left, top } = style

            // 解析位置
            const parseLeft: Position = parsePosition(left)
            const parseTop: Position = parsePosition(top)

            // 根据传入的位置类型设置 left 和 top
            if (parseLeft.type === 'percent') style.left = `${containerLeft + parseLeft.value * width}px`
            if (parseLeft.type === 'pixel') style.left = `${containerLeft + parseLeft.value}px`
            if (parseTop.type === 'percent') style.top = `${containerTop + parseTop.value * height}px`
            if (parseTop.type === 'pixel') style.top = `${containerTop + parseTop.value}px`

        }

        // 再次设置样式主要是为了设置 left 和 top
        Object.assign(watermark.style, style)
    }

}

//  定时器
let intervalId: number

// 随机生成水印
const runRandomRextWatermark = () => {
    if (textWatermarkRef.value && props.textWatermark?.style) {
        setWatermarkStyle(textWatermarkRef.value, props.textWatermark.style, true)
        intervalId = setInterval(() => {
            if (textWatermarkRef.value && props.textWatermark?.style) {
                setWatermarkStyle(textWatermarkRef.value, props.textWatermark.style, true)
            }
        }, 5000)
    }
}


// logo水印
const runLogoWatermark = () => {
    if (logoWatermarkRef.value && props.logoWatermark?.style) {
        setWatermarkStyle(logoWatermarkRef.value, props.logoWatermark.style, false)
    }
}


onMounted(() => {
    // 等待下一次 DOM 更新后执行
    nextTick(() => {
        runRandomRextWatermark()
        runLogoWatermark()
    })
})

onUnmounted(() => {
    // 清除定时器
    clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
.watermark {
    position: absolute;
}

.text-watermark {
    z-index: 9999;
}

.logo-watermark {
    z-index: 9998;
}
</style>