<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\link-list\link-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单个链接
-->

<template>
    <el-button type="default" :class="isShowDescription ? 'btn-has-description' : 'btn-no-description'" @click="handleClick">
        <div class="link-container">
            <div class="link-main">
                <AvatarInitials :avatar="data.thumbnail" :name="data.name" :size="size" />
                <span>{{ data.name }}</span>
            </div>
            <div class="link-description" v-if="isShowDescription">
                {{ truncatedDescription }}
            </div>
        </div>
    </el-button>
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
.btn-has-description {
    width: 200px;
    height: 124px;
    border: none;
}

.btn-no-description {
    height: 40px;
    border: none;
}

.link-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.link-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--jpz-text-color-primary);
    font-size: 14px;
    font-weight: 700;
}

.link-description {
    margin-top: 4px;
    text-align: left;
    font-size: 12px;
    color: var(--jpz-text-color-secondary);
    width: 100%;
    word-break: break-all;
    white-space: pre-line;
    overflow: hidden;
    line-height: 1.2;
}
</style>
