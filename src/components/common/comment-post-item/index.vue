<!--
 * FilePath    : blog-client\src\components\common\comment-post-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论文章信息
-->

<template>
    <div class="post-container">
        <div class="title-container">
            <div v-if="isAdmin" class="title-header">
                <span class="comment-summary">{{ totalCommentText }}</span>
                <span v-if="pendingCount > 0" class="review-summary">{{ pendingCommentText }}</span>
            </div>

            <el-button v-if="isAdmin" class="post-title" type="default" @click="handlePostClick">
                <span class="post-title-text">{{ post.post_title }}</span>
            </el-button>
            <el-button v-if="isAdmin" class="post-view" type="default" @click="handleViewPostClick">查看文章</el-button>

            <el-button v-if="!isAdmin" class="post-title post-title-without-badge" type="default" @click="handleViewPostClick">
                <span class="post-title-text">{{ post.post_title }}</span>
            </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { CommentReviewCode } from "@/api/comment/common"

import type { PostProps } from "./types"

defineOptions({ name: "CommentPostItem" })

// 定义 props
const { post, isAdmin = false } = defineProps<PostProps>()

// 事件
const emit = defineEmits<{
    (event: "post-click", postID: string): void
    (event: "view-post", postID: string): void
}>()

// 待处理
const pendingCount = computed(() => {
    for (const key in post.comment_count_by_status) {
        if (post.comment_count_by_status[key]!.status === CommentReviewCode.Pending) {
            return post.comment_count_by_status[key]!.count || 0
        }
    }
    return 0
})

// 已审核
const approvedCount = computed(() => {
    for (const key in post.comment_count_by_status) {
        if (post.comment_count_by_status[key]!.status === CommentReviewCode.Approved) {
            return post.comment_count_by_status[key]!.count || 0
        }
    }
    return 0
})

// 已拒绝
const rejectedCount = computed(() => {
    for (const key in post.comment_count_by_status) {
        if (post.comment_count_by_status[key]!.status === CommentReviewCode.Rejected) {
            return post.comment_count_by_status[key]!.count || 0
        }
    }
    return 0
})

// 所有评论数量
const allCount = computed(() => {
    return pendingCount.value + approvedCount.value + rejectedCount.value
})

// 总评论数说明文案
const totalCommentText = computed(() => {
    return `共 ${allCount.value} 条`
})

// 待审评论数说明文案
const pendingCommentText = computed(() => {
    return `待审 ${pendingCount.value} 条`
})

// 处理文章点击事件
const handlePostClick = () => {
    emit("post-click", post.id)
}

// 处理查看文章点击事件
const handleViewPostClick = () => {
    emit("view-post", post.id)
}
</script>
<style lang="scss" scoped>
.post-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.title-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding: 2px 0;
}

.title-header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    width: 100%;
    margin-bottom: 8px;
}

.review-summary,
.comment-summary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 20px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 12px;
    line-height: 20px;
}

.comment-summary {
    background: color-mix(in srgb, var(--el-fill-color) 86%, transparent);
    border: 1px solid var(--el-border-color-lighter);
    color: var(--el-text-color-secondary);
    white-space: nowrap;
}

.review-summary {
    background: color-mix(in srgb, var(--el-color-warning) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--el-color-warning) 28%, transparent);
    color: var(--el-color-warning-dark-2);
    white-space: nowrap;
}

.post-title {
    color: var(--jpz-text-color-primary);
    font-weight: 700;
    padding: 0;
    border: none;
    background-color: transparent;
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 0;
    margin-bottom: 4px;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover,
    &:focus {
        background-color: transparent;
        color: var(--jpz-color-primary);
    }

    :deep(.el-button__text) {
        display: block;
        width: 100%;
    }

    &:hover .post-title-text,
    &:focus .post-title-text {
        text-decoration: underline;
        text-underline-offset: 3px;
    }
}

.post-view {
    padding: 0;
    border: none;
    background-color: transparent;
    font-size: 12px;
    align-self: center;
}

.post-title-text {
    display: block;
    width: 100%;
    line-height: 24px;
    white-space: normal;
    word-break: break-word;
    text-align: center;
    padding: 0 4px;
}

// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
