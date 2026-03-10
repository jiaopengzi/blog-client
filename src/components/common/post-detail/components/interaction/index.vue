<!--
 * FilePath    : blog-client\src\components\common\post-detail\components\interaction\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 交互组件
-->

<template>
    <div class="container" :class="`container-${direction}`">
        <el-button v-for="item in interactionItems" :key="item.icon" :class="`btn-item ${item.icon}`" @click="(e: MouseEvent) => handleItemClick(e, item)">
            <el-tooltip
                :disabled="isTouch"
                effect="dark"
                :placement="tipPlacement"
                :content="item.tip ? `${item.text}：${item.tip}` : item.text"
                :hide-after="0"
                :show-after="300"
            >
                <j-icon :name="item.icon" :customClass="item.isActive ? 'my-icon-active' : 'my-icon'" />
            </el-tooltip>
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"

import type { InteractionIcon, InteractionItem, InteractionProps } from "./types"
defineOptions({ name: "DetailInteraction" })

// 定义 props
const { direction, items } = defineProps<InteractionProps>()

// 事件
const emit = defineEmits<{
    (event: "click-item", val: InteractionIcon): void
}>()

// 判断是否为触屏设备
const isTouch = ref(false)

onMounted(() => {
    isTouch.value = "ontouchstart" in window || navigator.maxTouchPoints > 0
})

/**
 * 处理项点击事件, 并在移动端移除焦点以闭合 tooltip
 *
 * @param e - 鼠标事件对象
 * @param item - 被点击的交互项
 */
const handleItemClick = (e: MouseEvent, item: InteractionItem) => {
    // 移除焦点，解决移动端点击后 tooltip 不消失和按钮状态残留的问题
    const target = e.currentTarget as HTMLElement | null
    if (target) {
        target.blur()
    }
    if (item.onClick) {
        item.onClick()
    }
}

// 初始状态
const initItems: InteractionItem[] = [
    {
        icon: "like",
        text: "点赞",
        isActive: false,
        onClick: () => {
            emit("click-item", "like")
        },
        tip: 0,
    },
    {
        icon: "star",
        text: "收藏",
        isActive: false,
        onClick: () => {
            emit("click-item", "star")
        },
        tip: 0,
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
        return {
            ...initItem,
            ...item,
        }
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
    font-size: 24px;
    transition: fill 0.3s ease;
}

:deep(.my-icon) {
    @extend %icon;

    fill: var(--jpz-text-color-placeholder);

    @media (any-hover: hover) {
        &:hover {
            fill: var(--jpz-text-color-primary);
        }
    }

    &:active {
        fill: var(--jpz-text-color-secondary);
    }
}

:deep(.my-icon-active) {
    @extend %icon;

    fill: var(--jpz-color-secondary);

    @media (any-hover: hover) {
        &:hover {
            fill: var(--jpz-text-color-primary);
        }
    }

    &:active {
        fill: var(--jpz-text-color-secondary);
    }
}

.btn-item {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: none;

    &:hover,
    &:focus {
        background-color: transparent;
    }
}

// // 媒体查询
// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
