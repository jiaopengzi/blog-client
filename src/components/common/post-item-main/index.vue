<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 15:50:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 10:49:58
 * @FilePath     : \blog-client\src\components\common\post-item-main\index.vue
 * @Description  : 单个文章元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="post-item">
        <!-- 左上角提示符 -->
        <div class="tip"></div>

        <!-- 左上角分类 -->
        <el-button class="category" plain @click="clickCategory(postData.categories[0])">{{
            postData.categories[0].name
        }}</el-button>

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

            <!-- 摘要文字 -->
            <div class="summary">
                <p>{{ postData.seo_description }}</p>
            </div>

            <!-- 作者 日志 访问量 -->
            <div class="meta">
                <span class="meta-avatar meta-item">
                    <AvatarInitials
                        :avatar="postData.author_info.user_avatar"
                        :name="postData.author_info.user_display_name"
                        :size="24"
                    />
                </span>
                <span class="meta-date meta-item">{{
                    formatTime(postData.created_at, "Asia/Shanghai", "YYYY-MM-DD")
                }}</span>
                <span v-if="!isZero(postData.view_count)" class="meta-view meta-item">
                    <el-icon><View /></el-icon>
                    <span class="meta-item-unit">{{ unit(postData.view_count) }}</span>
                </span>
                <span v-if="!isZero(postData.comment_count)" class="meta-comment meta-item">
                    <el-icon><ChatRound /></el-icon>
                    <span class="meta-item-unit">{{ unit(postData.comment_count) }}</span>
                </span>
            </div>
        </div>

        <!-- 阅读跳转 -->
        <el-button class="read-more" plain @click="postId(postData.id)">阅读全文</el-button>
    </div>
</template>

<script lang="ts" setup>
import type { PostResPagination } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { ChatRound, View } from "@element-plus/icons-vue"
import { unit, isZero } from "@/utils/unit"
import { formatTime } from "@/utils/dateTime"

import AvatarInitials from "@/components/common/avatar-initials"

defineOptions({ name: "PostItemMain" })

const { postData } = defineProps<{
    postData: PostResPagination
}>()

// 事件
const emit = defineEmits<{
    (event: "clickCategory", val: PostCategory): void
    (event: "postId", val: string): void
}>()

// 点击分类
const clickCategory = (val: PostCategory) => {
    emit("clickCategory", val)
}

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}
</script>
<style lang="scss" scoped>
// 公共样式
.post-item {
    position: relative;
    border-radius: 3px;
    padding: 15px;
    background-color: var(--jpz-bg-color);
    overflow: hidden;

    &:hover {
        // 鼠标移动到 .post-item 上时, .post-item 出现上下阴影
        // box-shadow: var(--jpz-post-item-main-hover-shadow);
        .read-more {
            opacity: 1;
        }
    }
}

.tip {
    position: absolute;
    top: 10px;
    left: 0;
    line-height: 200%;
    font-size: 14px;
    background-color: transparent;
    border-radius: 5%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    // 使用 ::before 伪元素添加红色外边框和绿色内边框
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0; // 使得红色外边框在 .tip 的左侧
        height: 28px;
        border-right: 6px solid var(--jpz-color-primary);
    }
}

.post-item:hover .tip {
    opacity: 1;
}

.category {
    position: absolute;
    top: 10px;
    left: 20px;
    padding-left: 10px;
    padding-right: 10px;
    z-index: 2;
    background-color: var(--jpz-color-primary);
    line-height: 200%;
    font-size: 14px;
    color: var(--jpz-bg-color);
    border-radius: 5%;
}

.thumbnail {
    float: left;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--jpz-border-color);

    .thumbnail-img {
        width: 100%;
        height: 100%;
        background-size: cover;
        transition: transform 0.3s ease;
        cursor: pointer;
    }

    &:hover .thumbnail-img {
        // 鼠标移动到 .thumbnail 上时, .thumbnail-img 放大
        transform: scale(1.2);
    }
}

.content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.title {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--jpz-text-color-primary);
    border: 0;
    padding: 0;
    line-height: 2em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.summary {
    margin-top: 5px;
    flex-grow: 1;
    color: var(--jpz-text-color-secondary);
    line-height: 1.5em;
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.meta {
    display: flex;
    align-items: center;
}

.meta-item {
    margin-right: 14px;
    color: var(--jpz-text-color-placeholder);
    font-size: 14px;
    line-height: 150%;

    // 图标居中
    display: flex;
    align-items: center;
    justify-content: center;
}

.meta-item-unit {
    margin-left: 4px;
}

.avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 5px;
}

.read-more {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 2;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: var(--jpz-color-primary);
    color: var(--jpz-bg-color);
    line-height: 150%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

// 媒体查询
@include respond-to("pc") {
    .post-item {
        height: 150px;
        padding: 20px;

        .tip,
        .read-more {
            opacity: 0;
        }
    }

    .thumbnail {
        width: 200px;
    }

    .content {
        margin-left: 210px;
    }

    .title {
        font-size: 16px;
        font-weight: 700;
        height: 2em;
        -webkit-line-clamp: 1; // 限制行数为1
    }

    .summary {
        height: 2em;
        -webkit-line-clamp: 4; // 限制行数为4
    }
}

@include respond-to("pad") {
    .post-item {
        height: 75px;

        .tip,
        .category,
        .summary,
        .read-more {
            display: none;
        }
    }

    .thumbnail {
        width: 100px;
    }

    .content {
        margin-left: 110px;
    }

    .title {
        height: 4em;
        -webkit-line-clamp: 2; // 限制行数为2
    }
}

@include respond-to("phone") {
    .post-item {
        height: 75px;

        .tip,
        .category,
        .summary,
        .read-more {
            display: none;
        }
    }

    .thumbnail {
        width: 100px;
    }

    .content {
        margin-left: 110px;
    }

    .title {
        height: 4em;
        -webkit-line-clamp: 2; // 限制行数为2
    }
}
</style>
