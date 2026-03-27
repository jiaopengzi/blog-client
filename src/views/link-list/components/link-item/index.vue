<!--
 * FilePath    : blog-client\src\views\link-list\components\link-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单个链接
-->

<template>
    <div :class="['link-item-card', isShowDescription ? 'with-desc' : 'no-desc']" @click="handleClick">
        <div class="link-header">
            <AvatarInitials :avatar="data.thumbnail" :name="data.name" :size="size" class="link-avatar" />
            <span class="link-name">{{ data.name }}</span>
        </div>
        <div v-if="isShowDescription" class="link-description">
            {{ truncatedDescription }}
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
.link-item-card {
    position: relative;
    border-radius: 8px;
    border: 1px solid var(--jpz-border-color-lighter);
    background-color: var(--jpz-bg-color-overlay);
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--jpz-box-shadow-light);
        border-color: var(--jpz-color-primary-light-5);
        background-color: var(--jpz-bg-color);

        .link-name {
            color: var(--jpz-color-primary);
        }
    }

    &.no-desc {
        height: 40px;
        align-items: center;
        padding: 0 8px;
    }

    &.with-desc {
        flex-direction: column;
        padding: 12px;
    }
}

.link-header {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    overflow: hidden;
    flex-shrink: 0;
}

.link-avatar {
    flex-shrink: 0;
}

.link-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--jpz-text-color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.link-description {
    font-size: 12px;
    line-height: 1.6;
    color: var(--jpz-text-color-secondary);
    margin-top: 8px;
    word-break: break-all;
    display: -webkit-box;
    line-clamp: 4;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
}

// 响应式设计：确保三端 Item 大小一致且受控
@include respond-to("pc") {
    .link-item-card.with-desc {
        width: 223px;
        height: 138px;
    }
}

@include respond-to("pad") {
    .link-item-card.with-desc {
        width: 223px;
        height: 138px;
    }
}

@include respond-to("phone") {
    .link-item-card.with-desc {
        width: 100%; // Phone端通常宽度撑满，但高度固定以保持一致性
        height: 110px;
    }
}
</style>
