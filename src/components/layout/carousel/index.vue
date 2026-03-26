<!--
 * FilePath    : blog-client\src\components\layout\carousel\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 轮播图
-->

<template>
    <div class="carousel-container" v-if="enable && items && items.length > 0">
        <el-carousel :height="height" :interval="interval" :loop="items.length > 1" :motion-blur="true">
            <el-carousel-item v-for="item in items" :key="item.imageUrl">
                <div class="carousel-link-wrapper" role="link" tabindex="0" @click="onClick(item.linkUrl)" @keydown.enter.prevent="onClick(item.linkUrl)">
                    <el-image
                        :src="item.imageUrl"
                        :alt="item.altText || 'Carousel Image'"
                        fit="contain"
                        :style="{ height: height, width: '100%' }"
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

import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "HomeCarousel" })

const optionsStore = useOptionsStore()

const { carousel } = storeToRefs(optionsStore)

const enable = computed(() => carousel.value.enable)
const interval = computed(() => carousel.value.interval)
const items = computed(() => carousel.value.items)
const height = "300px"

const onClick = (url?: string) => {
    const href = url || "/"
    const w = window.open(href, "_blank")
    if (w) w.opener = null
}
</script>

<style scoped lang="scss">
.demonstration {
    color: var(--jpz-text-color-secondary);
}

.el-carousel {
    border-radius: 4px;
    height: 300px;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.carousel-link-wrapper {
    cursor: pointer;
    display: block;
}

@include respond-to("pc") {
    .carousel-container {
        margin-bottom: 16px;
    }
}

@include respond-to("pad") {
    .carousel-container {
        padding: 0px 10px;
        margin-bottom: 16px;
    }
}

@include respond-to("phone") {
    .carousel-container {
        padding: 0px 10px;
        margin-bottom: 16px;
    }
}
</style>
