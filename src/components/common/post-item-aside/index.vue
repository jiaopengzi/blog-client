<!--
 * @FilePath     : \blog-client\src\components\common\post-item-aside\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 单个边栏文章组件
-->

<template>
    <div class="post-item">
        <!-- 缩略图 -->
        <div class="thumbnail">
            <PostThumbnail :src="postData.thumbnail" class="thumbnail-img" :initial="fallbackInitial" theme="aside" @click="postId(postData.id)" />
        </div>

        <!-- 文章摘要内容 -->
        <div class="content">
            <!-- 标题 -->
            <h2 class="title" @click="postId(postData.id)">{{ postData.post_title }}</h2>

            <!-- 作者 日志 访问量 -->
            <PostMeta :meta="postMeta" :is-hide-time-icon="true" :is-set-time-margin="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import type { PostResCommon } from "@/api/post/common"
import PostMeta, { type PostMetaProps } from "@/components/common/post-meta"
import PostThumbnail from "@/components/common/post-thumbnail"

defineOptions({ name: "PostItemAside" })

const { postData } = defineProps<{
    postData: PostResCommon
}>()

const fallbackInitial = computed(() => postData.post_title?.trim().slice(0, 1).toUpperCase() || "P")

// 文章元数据
const postMeta = computed(() => {
    const data: PostMetaProps = {
        created_at: postData.created_at,
        formatStr: "YYYY-MM-DD",
        view_count: postData.view_count,
    }
    return data
})

// 事件
const emit = defineEmits<{
    (event: "postId", val: string): void
}>()

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}
</script>
<style scoped lang="scss">
.post-item {
    display: flex;
    height: 75px;
    border-radius: 3px;
    overflow: hidden;

    &:hover {
        // 鼠标移动到 .post-item 上时, .post-item 出现上下阴影
        box-shadow: var(--jpz-post-item-main-hover-shadow);
    }
}

.thumbnail {
    width: 100px;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 3px;
}

.thumbnail-img {
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.3s ease;
    cursor: pointer;
}

.thumbnail:hover .thumbnail-img {
    transform: scale(1.2);
}

.content {
    width: calc(100% - 100px);
    height: 100%;
    padding-left: 5px;
}

.title {
    margin: 0;
    color: var(--jpz-text-color-primary);
    border: 0;
    padding: 0;
    height: 4em;
    line-height: 2em;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2; // 限制行数为2
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

// 当鼠标移动到 .title 上时, .title 的颜色变为 var(--jpz-color-primary)
.title:hover {
    color: var(--jpz-color-primary);
}
</style>
