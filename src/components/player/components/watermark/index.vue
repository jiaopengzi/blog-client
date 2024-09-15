<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-15 15:11:14
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-15 16:38:36
 * @FilePath     : \blog-client\src\components\player\components\watermark\index.vue
 * @Description  : 水印
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div>
        <template v-if="isTextWatermark">
            <i ref="watermarkRef" class="watermark">{{ textWatermarkContent }}</i>
        </template>
        <template v-else-if="isLogoWatermark">
            <img ref="watermarkRef" class="watermark" :src="logoWatermarkLogoSrc" />
        </template>
    </div>
</template>

<script setup lang="ts">

import { useTemplateRef, computed, onMounted, onUnmounted } from 'vue'
import { WatermarkEnum } from '@/stores/player'
import type { Watermark, TextWatermark, LogoWatermark, Logo } from '@/stores/player'

defineOptions({ name: 'VideoWatermark' })

// 定义props
const props = defineProps<{
    container: HTMLElement | null
    watermark: Watermark
}>()

const watermarkRef = useTemplateRef<HTMLElement | null>("watermarkRef")



// 检查是否是文字水印
const isTextWatermark = computed(() => props.watermark.type === WatermarkEnum.TEXT)

// 检查是否是 logo 水印
const isLogoWatermark = computed(() => props.watermark.type === WatermarkEnum.LOGO)


// 获取文字水印内容
const textWatermarkContent = computed(() => {
    if (isTextWatermark.value) {
        return (props.watermark as TextWatermark).content
    }
    return ''
})

// 获取 logo 水印 logo
const logoWatermarkLogoSrc = computed(() => {
    if (isLogoWatermark.value) {
        return (props.watermark as LogoWatermark).logo.imgUrl
    }
    return ''
})


// 设置文字水印的样式
const setTextWatermarkPosition = () => {
    const container = props.container
    const watermark = watermarkRef.value

    if (container && watermark) {
        // 获取容器的宽高
        const { clientWidth: containerWidth, clientHeight: containerHeight } = container

        // 获取水印的宽高
        const { clientWidth: watermarkWidth, clientHeight: watermarkHeight } = watermark

        // 获取容器的 Left 和 Top
        const { left: containerLeft, top: containerTop } = container.getBoundingClientRect()

        // 随机生成水印的位置
        const randomLeft = Math.random() * (containerWidth - watermarkWidth)
        const randomTop = Math.random() * (containerHeight - watermarkHeight)

        // 设置水印的位置
        watermark.style.left = `${containerLeft + randomLeft}px`
        watermark.style.top = `${containerTop + randomTop}px`
    }
};


const setRandomPosition = () => {
    const container = props.container
    const watermark = watermarkRef.value

    if (container && watermark) {
        // 获取容器的宽高
        const { clientWidth: containerWidth, clientHeight: containerHeight } = container

        // 获取水印的宽高
        const { clientWidth: watermarkWidth, clientHeight: watermarkHeight } = watermark

        // 获取容器的 Left 和 Top
        const { left: containerLeft, top: containerTop } = container.getBoundingClientRect()

        // 随机生成水印的位置
        const randomLeft = Math.random() * (containerWidth - watermarkWidth)
        const randomTop = Math.random() * (containerHeight - watermarkHeight)

        // 设置水印的位置
        watermark.style.left = `${containerLeft + randomLeft}px`
        watermark.style.top = `${containerTop + randomTop}px`
    }
};

let intervalId: number

const run = () => {
    setRandomPosition()
    intervalId = setInterval(setRandomPosition, 5000)
}

onMounted(() => {
    run()
})

onUnmounted(() => {
    clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
.watermark {
    position: absolute;
    color: red;
    z-index: 5;
}
</style>