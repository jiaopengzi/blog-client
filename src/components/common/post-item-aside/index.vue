<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-30 16:23:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-18 11:44:59
 * @FilePath     : \blog-client\src\components\common\post-item-aside\index.vue
 * @Description  : 单个文章元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="post-item">
        <!-- 缩略图 -->
        <div class="thumbnail">
            <el-image
                :src="postData.thumbnail"
                class="thumbnail-img"
                loading="lazy"
                @click="postId(postData.id)"
            >
            </el-image>
        </div>

        <!-- 文章摘要内容 -->
        <div class="content">
            <!-- 标题 -->
            <h2 class="title" @click="postId(postData.id)">{{ postData.post_title }}</h2>

            <!-- 作者 日志 访问量 -->
            <div class="meta">
                <span class="meta-date meta-item">{{
                    formatTime(postData.created_at, "Asia/Shanghai", "YYYY-MM-DD")
                }}</span>
                <span v-if="postData.view_count" class="meta-view meta-item">
                    <el-icon><View /></el-icon>
                    <span class="meta-item-unit">{{ unit(postData.view_count) }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PostResCommon } from "@/api/post/common"
import { View } from "@element-plus/icons-vue"
import { unit } from "@/utils/unit"
import { formatTime } from "@/utils/dateTime"

defineOptions({ name: "PostItemAside" })

const { postData } = defineProps<{
    postData: PostResCommon
}>()

// 事件
const emit = defineEmits<{
    (event: "postId", val: string): void
}>()

// 点击文章
const postId = (val: string) => {
    console.log(val)
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
    -webkit-line-clamp: 2; // 限制行数为2
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.meta {
    display: flex;
    justify-content: space-between;
}

.meta-item {
    color: var(--jpz-text-color-placeholder);
    font-size: smaller;
    line-height: 150%;
    // 图标居中
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
