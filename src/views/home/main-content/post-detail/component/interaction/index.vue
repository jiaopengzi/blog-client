<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\interaction\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 交互组件
-->

<template>
    <div class="container" :class="`container-${direction}`">
        <span v-for="item in interactionItems" :key="item.icon" :class="`item ${item.icon}`" @click="item.onClick">
            <el-tooltip effect="dark" :placement="tipPlacement" :content="item.tip ? `${item.text}：${item.tip}` : item.text" :hide-after="0" :show-after="300">
                <j-icon :name="item.icon" :customClass="item.isActive ? 'my-icon-active' : 'my-icon'" />
            </el-tooltip>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import type { InteractionIcon, InteractionItem, InteractionProps } from "./types"
defineOptions({ name: "DetailInteraction" })

// 定义 props
const { direction, items } = defineProps<InteractionProps>()

// 事件
const emit = defineEmits<{
    (event: "click-item", val: InteractionIcon): void
}>()

// 初始状态
const initItems: InteractionItem[] = [
    {
        icon: "like",
        text: "点赞",
        isActive: true,
        onClick: () => {
            emit("click-item", "like")
        },
        tip: 6,
    },
    {
        icon: "collect",
        text: "收藏",
        isActive: true,
        onClick: () => {
            emit("click-item", "collect")
        },
    },
    {
        icon: "share",
        text: "分享",
        isActive: false,
        onClick: () => {
            emit("click-item", "share")
        },
    },
    {
        icon: "link",
        text: "复制链接",
        isActive: false,
        onClick: () => {
            emit("click-item", "link")
        },
    },
]

// 根据传入的 items 生成交互项
const interactionItems = computed(() => {
    // 如果没有传入 items，则使用默认的 initItems
    if (!items) {
        return initItems
    }

    // 根据传入的 items 生成交互项
    return items.map((item) => {
        const initItem = initItems.find((i) => i.icon === item.icon)
        if (initItem) {
            return {
                ...initItem,
                count: item.tip,
            }
        }
        return item
    })
})

// 根据传入的 direction 设置 tip 的位置
const tipPlacement = computed(() => {
    if (direction === "horizontal") {
        return "top"
    } else {
        return "left"
    }
})
</script>

<style lang="scss" scoped>
// 横向
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

// 纵向
.container-vertical {
    flex-direction: column;
}

%icon {
    font-size: 28px;
    transition: fill 0.3s ease;
    cursor: pointer;
}

:deep(.my-icon) {
    @extend %icon;

    fill: var(--jpz-text-color-placeholder);

    &:hover {
        fill: var(--jpz-text-color-primary);
    }

    &:active {
        fill: var(--jpz-text-color-secondary);
    }
}

:deep(.my-icon-active) {
    @extend %icon;

    fill: var(--jpz-color-secondary);

    &:hover {
        fill: var(--jpz-text-color-primary);
    }

    &:active {
        fill: var(--jpz-text-color-secondary);
    }
}

// 媒体查询
@include respond-to("pc") {
}

@include respond-to("pad") {
}

@include respond-to("phone") {
}
</style>
