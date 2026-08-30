<!--
 * FilePath    : blog-client-nuxt\src\components\layout\carousel\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 轮播图 - 自适应多设备, 图片全覆盖无边框; 含首屏校准与图片加载双段骨架屏
-->

<!--
 * 补充说明:
 * 260828-1: 图片由 el-image 改为原生 <img> SSR 直出(el-image 的 img 仅在客户端
 * 挂载后渲染, SSR HTML 只有占位 div, SEO 收不到轮播图内容)
 * bug01(260829-01): 双段骨架屏, 均与 post-list-view 骨架屏同一套 shimmer(base:
 * border-color 80% + 高光: white 70%), 此前的主色 10% 淡扫光在首屏几乎不可见:
 * 1) .carousel-skeleton 挂 data-list-pending 门控——登录态首屏校准期(与列表骨架屏
 *    同一窗口)顶替真实轮播展示, 用户观感上轮播与列表同为骨架屏;
 * 2) .carousel-link-wrapper::before 图片下载占位——img 透明期间从 SSR 首帧起生效,
 *    覆盖匿名访问与校准结束后的图片尾部下载窗口
-->

<template>
    <div class="carousel-container" v-if="enable && items && items.length > 0" ref="containerRef">
        <!-- 骨架屏: 常驻渲染默认隐藏, 登录态首屏校准期(data-list-pending)经 CSS 顶替真实轮播;
             高度内联取 carouselHeight, 与轮播严格一致, 切换无布局抖动 -->
        <div class="carousel-skeleton" aria-hidden="true" :style="{ height: carouselHeight }"></div>
        <el-carousel :height="carouselHeight" :interval="interval" :loop="items.length > 1">
            <el-carousel-item v-for="(item, index) in items" :key="item.imageUrl">
                <div
                    class="carousel-link-wrapper"
                    :class="{ 'is-image-loaded': loadedImageIndexes.has(index) }"
                    role="link"
                    tabindex="0"
                    @click="onClick(item.linkUrl)"
                    @keydown.enter.prevent="onClick(item.linkUrl)"
                >
                    <img
                        :src="item.imageUrl"
                        :alt="item.altText || 'Carousel Image'"
                        class="carousel-image"
                        loading="eager"
                        decoding="async"
                        @load="markImageLoaded(index)"
                        @error="onImageError(item.imageUrl, index)"
                    />
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, onMounted, reactive, ref } from "vue"

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

// bug01(260829-01): 已完成加载的轮播项图片下标集合. SSR 与水合初始均为空集合, 双端 DOM 一致,
// 无 hydration mismatch; 图片 load/error 后标记, 对应项移除骨架动画
const loadedImageIndexes = reactive(new Set<number>())

const markImageLoaded = (index: number) => {
    loadedImageIndexes.add(index)
}

// 图片加载失败: 保留原有错误日志, 并同样结束该项骨架动画(破图不应无限扫光)
const onImageError = (imageUrl: string, index: number) => {
    console.error("Carousel Image load error:", imageUrl)
    markImageLoaded(index)
}

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
    // 兜底: 图片在水合完成前已下载结束(浏览器缓存命中)时 load 事件已错过,
    // 按 img.complete 实测状态补标记, 避免骨架动画在图片下方持续运行
    const imgs = containerRef.value?.querySelectorAll<HTMLImageElement>(".carousel-image") ?? []
    imgs.forEach((img, index) => {
        if (img.complete) markImageLoaded(index)
    })
})
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

// 每张轮播图的点击区域 - 撑满整个轮播项;
// 图片下载占位(双段骨架屏第 2 段, bug01 260829-01): 与 post-list-view 骨架屏同一套
// shimmer —— base 取 border-color 80%, 高光取 white 70%(与 .skeleton-thumb/.skeleton-line
// 完全一致), 图片下载完成前 img 为透明, 强可见占位从 SSR 首帧起生效(纯 CSS, 无 JS 参与显示);
// 此前 260828-1b 的主色 10% 淡扫光在首屏几乎不可见. 图片加载后自然覆盖占位,
// is-image-loaded 时移除 ::before, 避免被覆盖后仍无限重绘(background-position 动画
// 逐帧触发 paint, 不停止会持续消耗主线程)
.carousel-link-wrapper {
    cursor: pointer;
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            100deg,
            color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 40%,
            color-mix(in srgb, #ffffff 70%, transparent) 50%,
            color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 60%
        );
        background-size: 200% 100%;
        background-position: 150% 0;
        animation: carousel-skeleton-shimmer 1.4s ease-in-out infinite;
    }

    &.is-image-loaded::before {
        content: none;
    }
}

@keyframes carousel-skeleton-shimmer {
    0% {
        background-position: 150% 0;
    }
    100% {
        background-position: -50% 0;
    }
}

// 首屏校准期骨架屏(bug01 260829-01): 与 post-list-view 的 .post-list-skeleton 同一机制——
// 常驻渲染默认隐藏, html[data-list-pending] 存在期间(登录态首屏校准, app.vue 内联脚本在首帧
// 绘制前加标记)顶替真实轮播展示, 校准完成移除标记后切回真实轮播;
// SSR HTML 不含该标记, 爬虫仍可收录完整轮播内容
.carousel-skeleton {
    display: none;
    width: 100%;
    background: linear-gradient(
        100deg,
        color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 40%,
        color-mix(in srgb, #ffffff 70%, transparent) 50%,
        color-mix(in srgb, var(--jpz-border-color) 80%, transparent) 60%
    );
    background-size: 200% 100%;
    background-position: 150% 0;
    animation: carousel-skeleton-shimmer 1.4s ease-in-out infinite;
}

:global(html[data-list-pending] .carousel-container .carousel-skeleton) {
    display: block;
}

// 校准期隐藏真实轮播(display: none 后高度由骨架屏内联高度承接, 无布局塌陷)
:global(html[data-list-pending] .carousel-container .el-carousel) {
    display: none;
}

// 覆盖 Element Plus 默认样式: 去除圆角, 防止背景色从边角透出
:deep(.el-carousel) {
    border-radius: 0;
}

// 每个轮播项使用页面背景色填充, 防止图片加载前出现杂色
:deep(.el-carousel__item) {
    background-color: var(--jpz-bg-color-page);
}

// 原生 img 直接撑满轮播项(SSR 直出), 无间隙; 图片加载完成后覆盖容器 shimmer 骨架
.carousel-image {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
</style>
