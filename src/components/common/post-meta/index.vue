<!--
 * FilePath    : blog-client\src\components\common\post-meta\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情 meta 信息
-->

<template>
    <div class="title-container" v-if="metaData.post_title">
        <!-- 文章标题 -->
        <h1 class="title">{{ metaData.post_title }}</h1>
    </div>

    <div class="meta-container">
        <div class="meta">
            <!-- 作者头像 -->
            <el-button class="meta-avatar meta-item" v-if="metaData.author_display_name" plain @click="authorId(metaData.author_id)">
                <AvatarInitials :avatar="metaData.author_avatar" :name="metaData.author_display_name" :size="metaData.avatar_size" />
            </el-button>

            <!-- 创建时间 -->
            <span class="meta-date meta-item" v-if="metaData.created_at">
                <j-icon name="time" customClass="meta-icon" />
                <span class="meta-text">{{ formatTime(metaData.created_at, metaData.timeZone, metaData.formatStr) }}</span>
            </span>

            <!-- 浏览量 -->
            <span v-if="!isZero(metaData.view_count)" class="meta-view meta-item">
                <j-icon name="view" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.view_count) }}</span>
            </span>

            <!-- 评论量 -->
            <span v-if="!isZero(metaData.comment_count)" class="meta-comment meta-item">
                <j-icon name="comment" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.comment_count) }}</span>
            </span>

            <!-- 点赞 -->
            <span v-if="!isZero(metaData.like_count)" class="meta-like meta-item">
                <j-icon name="like" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.like_count) }}</span>
            </span>

            <!-- 收藏 -->
            <span v-if="!isZero(meta.collect_count)" class="meta-collect meta-item">
                <j-icon name="collect" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.collect_count) }}</span>
            </span>

            <!-- 文章字数 -->
            <span v-if="!isZero(metaData.words_count)" class="meta-words meta-item">
                <j-icon name="words" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.words_count) }}</span>
            </span>

            <!-- 阅读时间 -->
            <span v-if="!isZero(metaData.words_count) && metaData.is_show_read_time" class="meta-read-time meta-item">
                <j-icon name="hourglass" customClass="meta-icon" />
                <span class="meta-text">{{ takeTime }}</span>
            </span>

            <!-- 阅读模式 -->
            <span class="meta-item" v-if="metaData.is_immersion_read">
                <el-button class="immersion-read" plain @click="immersionRead">沉浸阅读</el-button>
            </span>

            <!-- 作者编辑 -->
            <span class="meta-item" v-if="metaData.is_author_edit">
                <el-button class="author-edit" plain @click="postId(metaData.post_id)">
                    <j-icon name="edit" customClass="meta-icon" />
                </el-button>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import AvatarInitials from "@/components/common/avatar-initials"
import { formatTime } from "@/utils/dateTime"
import { isZero, unit } from "@/utils/unit"

import { type PostMetaProps } from "./types"

defineOptions({ name: "PostMeta" })

const { meta } = defineProps<{
    meta: PostMetaProps
}>()

// 事件
const emit = defineEmits<{
    (event: "post-id", val: string): void
    (event: "author-id", val: string): void
    (event: "immersion-read"): void
}>()

// 处理默认值
const metaData = computed(() => {
    return {
        ...meta,
        is_show_read_time: meta.is_show_read_time || false,
        avatar_size: meta.avatar_size || 24, // 头像大小，默认 24px
        post_id: meta.post_id || "",
        author_id: meta.author_id || "",
    }
})

// 点击文章
const postId = (val: string) => {
    emit("post-id", val)
}

// 点击作者
const authorId = (val: string) => {
    emit("author-id", val)
}

// 沉浸阅读
const immersionRead = () => {
    emit("immersion-read")
}

// 计算阅读用时
const takeTime = computed(() => {
    let readTime = 0
    if (metaData.value.words_count) {
        const wordsCount = Number(metaData.value.words_count)
        readTime = wordsCount / 200 // 200字/分钟
    }
    // 小于 1 分钟, 显示小于1分钟; 大于 1 分钟, 小于 60 分钟, 显示分钟和秒; 大于 60 分钟, 显示小时和分钟
    if (readTime < 1) {
        return "小于1分钟"
    } else if (readTime < 60) {
        const minutes = Math.floor(readTime)
        const seconds = Math.round((readTime - minutes) * 60)
        if (seconds === 0) {
            return `${minutes}分钟`
        }
        if (minutes === 0) {
            return `${seconds}秒`
        }
        return `${minutes}分钟${seconds}秒`
    } else {
        const hours = Math.floor(readTime / 60)
        const minutes = Math.floor(readTime % 60)
        if (minutes === 0) {
            return `${hours}小时`
        }
        return `${hours}小时${minutes}分钟`
    }
})
</script>

<style lang="scss" scoped>
.title-container {
    // 居中
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.title {
    line-height: 150%;
    color: var(--jpz-color-primary);
    font-weight: 700;
    font-size: 24px;
    display: table;
    border-bottom: 2px solid var(--jpz-color-primary);
    text-align: center;
    padding: 20px 0 0 0;
    margin: 0 20px 20px 20px;
}

.meta-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.meta {
    display: flex;
    align-items: center;
}

.immersion-read {
    font-weight: 400;
}

.meta-avatar,
.immersion-read,
.author-edit {
    color: var(--jpz-text-color-placeholder);
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
}

.meta-item {
    margin-right: 10px;
    color: var(--jpz-text-color-placeholder);
    font-size: 14px;
    line-height: 150%;

    // 图标和文字水平居中
    display: inline-flex;
    align-items: center;
}

.meta-text {
    margin-left: 4px;
    display: inline-block;
    line-height: 1; // 确保文字垂直居中
}

:deep(.meta-icon) {
    fill: var(--jpz-text-color-placeholder);
}

// 媒体查询
// @include respond-to("pc") {
// }

@include respond-to("pad") {
    .immersion-read,
    .author-edit {
        display: none;
    }
}

@include respond-to("phone") {
    .meta-words,
    .immersion-read,
    .author-edit {
        display: none;
    }
}
</style>
