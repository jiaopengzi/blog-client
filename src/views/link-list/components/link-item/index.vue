<!--
 * FilePath    : blog-client\src\views\link-list\components\link-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单个链接
-->

<template>
    <div :class="isShowDescription ? 'btn-has-description' : 'btn-no-description'" @click="handleClick">
        <div class="link-container">
            <div class="link-main">
                <AvatarInitials :avatar="data.thumbnail" :name="data.name" :size="size" />
                <span>{{ data.name }}</span>
            </div>
            <div class="link-description" v-if="isShowDescription">
                {{ truncatedDescription }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { type LinkRes } from "@/api/link/common"
import AvatarInitials from "@/components/common/avatar-initials"

import type { LinkItemProps } from "./types"

defineOptions({ name: "LinkItem" })

// 定义 props
const { data, size = 24, isShowDescription = false, truncatedCount = 50 } = defineProps<LinkItemProps>()

// 事件
const emit = defineEmits<{
    (event: "link-click", item: LinkRes): void
}>()

const handleClick = () => {
    emit("link-click", data)

    // 跳转
    if (data.url) {
        window.open(data.url, "_blank")
    }
}

// 截断描述
const truncatedDescription = computed(() => {
    if (!data.description) return ""
    return data.description.length > truncatedCount ? data.description.slice(0, truncatedCount) + "..." : data.description
})
</script>
<style lang="scss" scoped>
// link共用样式占位
%common-link-style {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid var(--jpz-border-color);

    // 鼠标悬停样式
    &:hover {
        cursor: pointer;
        box-shadow: var(--jpz-box-shadow-light);
    }
}

.btn-has-description {
    @extend %common-link-style;
    width: 200px;
    height: 124px;
    padding-top: 16px;
}

.btn-no-description {
    @extend %common-link-style;
    min-width: 100px;
    height: 24px;
}

.link-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.link-main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    color: var(--jpz-text-color-primary);
    font-size: 14px;
    font-weight: 700;
    width: 100%;
    overflow: hidden;
}

.link-description {
    text-align: left;
    font-size: 12px;
    color: var(--jpz-text-color-secondary);
    width: 100%;
    word-break: break-all;
    white-space: pre-line;
    overflow: hidden;
    line-height: 1.5;
    margin-top: 8px; // 添加间距
    flex-grow: 1; // 让描述部分占据剩余空间
}
</style>
