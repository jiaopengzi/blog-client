<!--
 * FilePath    : blog-client\src\components\common\comment-post-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论文章信息
-->

<template>
    <div class="post-container">
        <el-badge v-if="pendingCount > 0" :value="pendingCount" class="badge-item title-container" :max="99" :offset="[9, 8]">
            <el-button class="post-title" type="default" @click="handlePostClick">{{ `${post.post_title} (${allCount})` }}</el-button>
            <el-button class="post-view" type="default" @click="handleViewPostClick">查看文章</el-button>
        </el-badge>
        <div v-else class="title-container">
            <el-button class="post-title post-title-without-badge" type="default" @click="handlePostClick">{{ `${post.post_title} (${allCount})` }}</el-button>
            <el-button class="post-view" type="default" @click="handleViewPostClick">查看文章</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { CommentReviewCode } from "@/api/comment/common"

import type { PostProps } from "./types"

defineOptions({ name: "CommentPostItem" })

// 定义 props
const { post } = defineProps<PostProps>()

// 事件
const emit = defineEmits<{
    (event: "post-click", postID: string): void
    (event: "view-post", postID: string): void
}>()

// 待处理
const pendingCount = computed(() => {
    for (const key in post.comment_count_by_status) {
        if (post.comment_count_by_status[key].status === CommentReviewCode.Pending) {
            return post.comment_count_by_status[key].count || 0
        }
    }
    return 0
})

// 已审核
const approvedCount = computed(() => {
    for (const key in post.comment_count_by_status) {
        if (post.comment_count_by_status[key].status === CommentReviewCode.Approved) {
            return post.comment_count_by_status[key].count || 0
        }
    }
    return 0
})

// 已拒绝
const rejectedCount = computed(() => {
    for (const key in post.comment_count_by_status) {
        if (post.comment_count_by_status[key].status === CommentReviewCode.Rejected) {
            return post.comment_count_by_status[key].count || 0
        }
    }
    return 0
})

// 所有评论数量
const allCount = computed(() => {
    return pendingCount.value + approvedCount.value + rejectedCount.value
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
    // 居中
    display: flex;
    justify-content: center;
    align-items: center;
}

// 右上角数字徽标
.badge-item {
    margin: 10px 30px;
}

.title-container {
    // 列表布局
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.post-title {
    // 清除默认样式
    color: var(--el-color-primary);
    font-weight: 700;
    padding: 0;
    border: none;
    background-color: transparent;
}

.post-view {
    // 清除默认样式
    padding: 0;
    border: none;
    background-color: transparent;
    font-size: 12px;
}

// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
