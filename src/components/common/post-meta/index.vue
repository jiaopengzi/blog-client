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
            <span :class="`meta-date meta-item ${customClass}`" v-if="metaData.created_at">
                <j-icon name="time" customClass="meta-icon meta-icon-time" />
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
            <span v-if="!isZero(metaData.like_count) && convert(opt.show_like_enable)" class="meta-like meta-item">
                <j-icon name="like" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.like_count) }}</span>
            </span>

            <!-- 收藏 -->
            <span v-if="!isZero(meta.star_count) && convert(opt.show_star_enable)" class="meta-star meta-item">
                <j-icon name="star" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.star_count) }}</span>
            </span>

            <!-- 文章字数 -->
            <span v-if="!isZero(metaData.words_count) && convert(opt.word_count_enable)" class="meta-words meta-item">
                <j-icon name="words" customClass="meta-icon" />
                <span class="meta-text">{{ unit(metaData.words_count) }}</span>
            </span>

            <!-- 阅读时间 -->
            <span v-if="!isZero(metaData.words_count) && convert(opt.word_count_enable)" class="meta-read-time meta-item">
                <j-icon name="hourglass" customClass="meta-icon" />
                <span class="meta-text">{{ takeTime }}</span>
            </span>

            <!-- 阅读模式 -->
            <span class="meta-immersion-read meta-item" v-if="metaData.is_immersion_read && convert(opt.immersion_read_enable)">
                <el-button class="immersion-read" plain @click="immersionRead">沉浸阅读</el-button>
            </span>

            <!-- 作者编辑 -->
            <span class="meta-author-edit meta-item" v-if="metaData.is_author_edit">
                <el-button class="author-edit" plain @click="postId(metaData.post_id)">
                    <j-icon name="edit" customClass="meta-icon" />
                </el-button>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { convert } from "@/api/setting/getAPPOption"
import AvatarInitials from "@/components/common/avatar-initials"
import { useOptionsStore } from "@/stores/options"
import { formatTime } from "@/utils/dateTime"
import { isZero, unit } from "@/utils/unit"

import { type PostMetaProps } from "./types"

defineOptions({ name: "PostMeta" })

const {
    meta,
    isHideTimeIcon = false,
    isSetTimeMargin = false,
} = defineProps<{
    meta: PostMetaProps
    isHideTimeIcon?: boolean // 是否隐藏时间图标，默认 false
    isSetTimeMargin?: boolean // 是否设置时间边距，默认 false
}>()

// 事件
const emit = defineEmits<{
    (event: "post-id", val: string): void
    (event: "author-id", val: string): void
    (event: "immersion-read"): void
}>()

// 获取全局配置
const optionsStore = useOptionsStore()
const { app_options: opt } = storeToRefs(optionsStore)

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

// 计算自定义 class
const customClass = computed(() => {
    const hideIcon = "meta-date-hide-icon"
    const setMargin = "meta-date-set-margin"
    if (isHideTimeIcon && isSetTimeMargin) {
        return `${hideIcon} ${setMargin}`
    } else if (isHideTimeIcon) {
        return hideIcon
    } else if (isSetTimeMargin) {
        return setMargin
    } else {
        return ""
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
    line-height: 1.5;
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
    // width: 100%;
    // 靠左显示
    display: flex;
    justify-content: flex-start;
}

.meta {
    // width: 100%;
    // 只显示一行, 每个子元素宽度自适应
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    justify-content: left;
    align-items: center;
}

.meta-item {
    // 这里不设置字体大小，使用媒体查询设置
    color: var(--jpz-text-color-placeholder);
    line-height: 1.5;
    display: grid;
    grid-template-columns: 14px auto;
    grid-gap: 4px;
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

// 覆盖头像和沉浸阅读固定宽度，让内容自适应
.meta-avatar,
.meta-immersion-read {
    grid-template-columns: auto;
}

.meta-text {
    line-height: 1.5; // 确保文字垂直居中
    font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;
}

:deep(.meta-icon) {
    fill: var(--jpz-text-color-placeholder);
}

// 媒体查询
@include respond-to("pc") {
    .meta-item {
        font-size: 14px;
    }

    .meta-avatar,
    .meta-date,
    .meta-view,
    .meta-comment,
    .meta-like,
    .meta-star,
    .meta-words,
    .meta-read-time,
    .meta-immersion-read {
        margin-right: 12px;
    }
}

@include respond-to("pad") {
    .immersion-read,
    .author-edit {
        display: none;
    }

    // 使用等宽字体
    .meta-text {
        font-family: monospace;
    }

    .meta-avatar,
    .meta-date,
    .meta-view,
    .meta-comment,
    .meta-like,
    .meta-star,
    .meta-words,
    .meta-read-time,
    .meta-immersion-read {
        margin-right: 12px;
    }
}

@include respond-to("phone") {
    .meta-read-time,
    .meta-words,
    .immersion-read,
    .author-edit {
        display: none;
    }

    .title {
        font-weight: 700;
        font-size: 18px;
    }

    // 使用等宽字体
    .meta-text {
        font-family: monospace;
    }

    .meta-avatar,
    .meta-date,
    .meta-view,
    .meta-comment,
    .meta-like {
        margin-right: 6px;
    }
}

// **注意 meta-date-set-margin 和 meta-date-hide-icon 要放在最后面，避免被覆盖**

// 隐藏时间图标样式
.meta-date-set-margin {
    // 在文章列表时间, 将 margin-right 加大, 让间距更明显
    margin-right: 32px;
}

// 隐藏时间图标样式
.meta-date-hide-icon {
    // 让 date 自适应宽度
    grid-template-columns: auto;

    // 不显示时间的icon
    :deep(.meta-icon-time) {
        display: none;
    }
}
</style>
