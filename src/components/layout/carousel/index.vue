<!--
 * FilePath    : blog-client\src\components\layout\carousel\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 轮播图 - 自适应多设备, 图片全覆盖无边框
-->

<template>
    <div class="carousel-container" v-if="enable && items && items.length > 0">
        <el-carousel :height="carouselHeight" :interval="interval" :loop="items.length > 1">
            <el-carousel-item v-for="item in items" :key="item.imageUrl">
                <div class="carousel-link-wrapper" role="link" tabindex="0" @click="onClick(item.linkUrl)" @keydown.enter.prevent="onClick(item.linkUrl)">
                    <el-image
                        :src="item.imageUrl"
                        :alt="item.altText || 'Carousel Image'"
                        fit="cover"
                        class="carousel-image"
                        @error="console.error('Carousel Image load error:', item.imageUrl)"
                    />
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { DeviceType, useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "HomeCarousel" })

const optionsStore = useOptionsStore()
const deviceStore = useDeviceStore()

const { carousel } = storeToRefs(optionsStore)
const { device } = storeToRefs(deviceStore)

const enable = computed(() => carousel.value.enable)
const interval = computed(() => carousel.value.interval)
const items = computed(() => carousel.value.items)

// 根据设备类型返回轮播图高度, phone 最小, pc 最大
const carouselHeight = computed(() => {
    if (device.value === DeviceType.PHONE) return "180px"
    if (device.value === DeviceType.PAD) return "240px"
    return "300px"
})

const onClick = (url?: string) => {
    const href = url || "/"
    const w = window.open(href, "_blank")
    if (w) w.opener = null
}
</script>

<style scoped lang="scss">
// 轮播图外层容器 - 隐藏溢出, 底部保留间距
.carousel-container {
    width: 100%;
    overflow: hidden;
    margin-bottom: 16px;
}

@include respond-to("pad") {
    // pad 端左右留出与 post-list 一致的间距; width: auto 覆盖基础 100%, 使右侧 margin 生效
    .carousel-container {
        width: auto;
        margin-left: 10px;
        margin-right: 10px;
    }
}

@include respond-to("phone") {
    // phone 端左右留出与 post-list 一致的间距; width: auto 覆盖基础 100%, 使右侧 margin 生效
    .carousel-container {
        width: auto;
        margin-left: 10px;
        margin-right: 10px;
    }
}

// 每张轮播图的点击区域 - 撑满整个轮播项
.carousel-link-wrapper {
    cursor: pointer;
    display: block;
    width: 100%;
    height: 100%;
}

// 覆盖 Element Plus 默认样式: 去除圆角, 防止背景色从边角透出
:deep(.el-carousel) {
    border-radius: 0;
}

// 每个轮播项使用页面背景色填充, 防止图片加载前出现杂色
:deep(.el-carousel__item) {
    background-color: var(--jpz-bg-color-page);
}

// 强制 el-image 及其内部 img 完整撑满轮播项, 无间隙
:deep(.el-carousel__item .el-image) {
    width: 100%;
    height: 100%;
    display: block;
}

:deep(.el-carousel__item .el-image img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
</style>
