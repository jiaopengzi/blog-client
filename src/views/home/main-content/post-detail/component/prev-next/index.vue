<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\prev-next\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 上一篇下一篇
-->

<template>
    <div class="prev-next">
        <div class="prev">
            <div class="content" v-if="isShowPrev">
                <div class="img-container">
                    <img v-if="data.prev.thumbnail" class="img-item" :src="data.prev.thumbnail" />
                </div>
                <div class="text">
                    <p class="text-prev" @click="handleClick(data.prev.id)">上一篇</p>
                    <p class="title" @click="handleClick(data.prev.id)">{{ data.prev.post_title }}</p>
                </div>
            </div>
            <div class="content-null" v-else>
                <span class="text-null">没有上一篇</span>
            </div>
        </div>
        <div class="next">
            <div class="content" v-if="isShowNext">
                <div class="img-container">
                    <img v-if="data.next.thumbnail" class="img-item" :src="data.next.thumbnail" />
                </div>
                <div class="text">
                    <p class="text-next" @click="handleClick(data.next.id)">下一篇</p>
                    <p class="title" @click="handleClick(data.next.id)">{{ data.next.post_title }}</p>
                </div>
            </div>
            <div class="content-null" v-else>
                <span class="text-null">没有下一篇</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import type { PrevNextProps } from "./types"

defineOptions({ name: "DetailPrevNext" })

// 定义 props
const { data } = defineProps<{ data: PrevNextProps }>()

// 事件
const emit = defineEmits<{
    (event: "post-id", id: string): void
}>()

const isShowPrev = computed(() => {
    if (!data.prev) return false
    if (data.prev && data.prev.id) return data.prev.id !== "0"
    return false
})

const isShowNext = computed(() => {
    if (!data.next) return false
    if (data.next && data.next.id) return data.next.id !== "0"
    return false
})

// 事件处理函数
const handleClick = (id: string) => {
    emit("post-id", id)
}
</script>

<style lang="scss" scoped>
// 网格布局一分为二
.prev-next {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 100px;
    background-color: var(--jpz-bg-color);
}

.prev {
    border-right: 1px solid var(--jpz-border-color);
}

.content {
    display: grid;
    // 文字使用剩余空间
    grid-template-columns: auto 1fr; // 图片和文字的比例
    align-items: center;
}

.img-container {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-start; // 左对齐
    padding-left: 10px;
    margin-right: 10px;
}

.img-item {
    max-height: 80px;
    object-fit: cover; // 确保图片保持比例
    border-radius: 5px;
}

.text {
    padding-right: 10px;
    min-width: 0; // 防止文字撑开有滚动条
}

.text-prev,
.text-next {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    margin-bottom: 10px;
    // 手型光标
    cursor: pointer;
    // 颜色变化的过渡效果
    transition: color 0.3s ease;
}

// 鼠标移入时的样式
.text-prev:hover,
.text-next:hover {
    color: var(--jpz-text-color-primary);
}

.title {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    font-weight: 700;
    line-height: 2;
    // 只显示一行, 多余的显示省略号
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
}

.text-null {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    text-align: center;
    line-height: 100px; // 垂直居中
    padding-left: 20px;
}

// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

@include respond-to("phone") {
    .content {
        height: 100px;
        padding-left: 20px;
    }
    .img-container {
        display: none; // 手机端不显示图片
    }
}
</style>
