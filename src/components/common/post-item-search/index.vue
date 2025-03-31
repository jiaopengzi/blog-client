<!--
 * FilePath    : blog-client\src\components\common\post-item-search\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索结果列表项
-->

<template>
    <div class="post-item">
        <h4 class="title" @click="postId(postData.id)" v-html="displayText"></h4>
        <span class="meta">{{ formatTime(postData.created_at, "Asia/Shanghai", "YYYY-MM-DD") }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { type PostResPagination } from "@/api/post/common"
import { formatTime } from "@/utils/dateTime"

defineOptions({ name: "PostItemSearch" })

const {
    postData,
    highlight = {},
    highlightKey,
} = defineProps<{
    postData: PostResPagination
    highlight?: Record<string, string[]> // 高亮内容
    highlightKey?: string // 高亮的key
}>()

// 事件
const emit = defineEmits<{
    (event: "postId", val: string): void
}>()

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}

// 根据 highlightKey 获取高亮内容
const highlightText = computed(() => {
    const key = highlightKey || "post_title"
    const highlights = highlight[key] || []
    return highlights.length > 0 ? highlights[0] : ""
})

// 显示的文本，如果有高亮内容，则显示高亮内容，否则显示文章标题
const displayText = computed(() => {
    // 获取文章标题
    const title = postData.post_title || ""
    // 如果有高亮内容，则返回高亮内容，否则返回文章标题
    return highlightText.value ? highlightText.value : title
})
</script>
<style lang="scss" scoped>
.post-item {
    padding: 15px;
    background-color: var(--jpz-bg-color);
    // meta 信息居右,title 占用剩余空间
    display: flex;
    align-items: center;
}

.meta {
    color: var(--jpz-text-color-secondary);
    margin-left: 10px; // 左边距
    margin-bottom: 0px;
    margin-top: 0px;
}

.title {
    flex: 1; // 使标题占据剩余空间
    cursor: pointer;
    // height: 1.5em;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--jpz-text-color-secondary);
    font-weight: 600;
    line-height: 1.5em; // 行高
    margin-bottom: 0px;
    margin-top: 0px;
}

.title:hover {
    color: var(--jpz-color-primary);
}

// 媒体查询
@include respond-to("pc") {
    .title {
        -webkit-line-clamp: 1; // 限制行数为1
    }
}

@include respond-to("pad") {
    .title {
        -webkit-line-clamp: 2; // 限制行数为2
    }
}

@include respond-to("phone") {
    .title {
        -webkit-line-clamp: 2; // 限制行数为2
    }
}
</style>
