<!--
 * FilePath    : blog-client\src\components\common\post-item-search\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索结果列表项
-->

<template>
    <div class="search-item" @click="postId(postData.id)">
        <!-- 左侧缩略图 -->
        <div class="thumbnail-wrap" v-if="hasThumbnail">
            <PostThumbnail :src="postData.thumbnail" :initial="fallbackInitial" theme="main" />
        </div>

        <!-- 右侧内容 -->
        <div class="content">
            <!-- 标题 -->
            <h3 class="title" v-stable-html="displayText"></h3>

            <!-- 描述 -->
            <p class="description" v-if="postData.seo_description">{{ postData.seo_description }}</p>

            <!-- 底部：分类 + 元信息 -->
            <div class="footer">
                <!-- 分类标签 -->
                <div class="categories" v-if="postData.categories && postData.categories.length > 0">
                    <span v-for="cat in postData.categories.slice(0, 2)" :key="cat.id" class="category-chip">{{ cat.name }}</span>
                </div>

                <!-- 元信息 -->
                <div class="meta-row">
                    <span class="meta-item">
                        <j-icon name="time" custom-class="meta-icon" />
                        <span>{{ formatTime(postData.created_at, "Asia/Shanghai", "YYYY-MM-DD") }}</span>
                    </span>
                    <span class="meta-item" v-if="postData.view_count && postData.view_count !== '0'">
                        <j-icon name="view" custom-class="meta-icon" />
                        <span>{{ unit(postData.view_count) }}</span>
                    </span>
                    <span class="meta-item" v-if="postData.comment_count && postData.comment_count !== '0'">
                        <j-icon name="comment" custom-class="meta-icon" />
                        <span>{{ unit(postData.comment_count) }}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { type PostResPagination } from "@/api/post/common"
import PostThumbnail from "@/components/common/post-thumbnail"
import { formatTime } from "@/utils/dateTime"
import { unit } from "@/utils/unit"

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

// 是否有缩略图
const hasThumbnail = computed(() => Boolean(postData.thumbnail?.trim()))

// 标题首字母作为缩略图 fallback
const fallbackInitial = computed(() => postData.post_title?.trim().slice(0, 1).toUpperCase() || "P")

// 根据 highlightKey 获取高亮内容
const highlightText = computed(() => {
    // 如果没有高亮内容，返回空字符串
    if (!highlight || Object.keys(highlight).length === 0) {
        return ""
    }

    // 获取高亮内容
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
.search-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 15px;
    background-color: var(--jpz-bg-color);
    cursor: pointer;
    transition:
        box-shadow 0.25s ease,
        background-color 0.25s ease;

    &:hover {
        // 用 inset box-shadow 模拟左侧高亮描边，不影响外框 border
        box-shadow: inset 3px 0 0 var(--jpz-color-primary);
        background-color: var(--jpz-bg-color-hover, var(--jpz-bg-color));

        .title {
            color: var(--jpz-color-primary);
        }
    }
}

.thumbnail-wrap {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--jpz-border-color);
}

.content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    color: var(--jpz-text-color-primary);
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    transition: color 0.25s ease;
}

.description {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--jpz-text-color-secondary);
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    -webkit-line-clamp: 1;
}

.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
}

.categories {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.category-chip {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.6;
    color: var(--jpz-color-primary);
    background-color: var(--jpz-color-primary-light-9, rgba(64, 158, 255, 0.1));
    white-space: nowrap;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--jpz-text-color-placeholder, var(--jpz-text-color-secondary));
    white-space: nowrap;
}

.meta-icon {
    width: 13px;
    height: 13px;
    fill: currentColor;
}

// 媒体查询
@include respond-to("pc") {
    .title {
        line-clamp: 1;
        -webkit-line-clamp: 1;
    }

    .description {
        line-clamp: 1;
        -webkit-line-clamp: 1;
    }

    .thumbnail-wrap {
        width: 72px;
        height: 72px;
    }
}

@include respond-to("pad") {
    .thumbnail-wrap {
        width: 64px;
        height: 64px;
    }
}

@include respond-to("phone") {
    .thumbnail-wrap {
        display: none;
    }

    .title {
        font-size: 14px;
        line-clamp: 2;
        -webkit-line-clamp: 2;
    }

    .description {
        line-clamp: 2;
        -webkit-line-clamp: 2;
    }

    .footer {
        flex-direction: column;
        align-items: flex-start;
    }

    .meta-row {
        align-self: flex-end;
    }
}
</style>
