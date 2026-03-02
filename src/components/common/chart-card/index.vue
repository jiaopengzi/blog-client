<!--
 * FilePath    : blog-client\src\components\common\chart-card\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 卡片图
-->
<template>
    <div :class="isClick ? `card-container-click` : `card-container`" ref="cardRef" @click="handleClick">
        <div class="value" v-if="isAmountFen">{{ unitNumber(fenToYuan(value), 1) }}</div>
        <div class="value" v-if="!isAmountFen">{{ unitNumber(value, 1) }}</div>
        <div class="label">{{ label }}</div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, useTemplateRef } from "vue"

import { fenToYuan } from "@/utils/amount"
import { unitNumber } from "@/utils/unit"

import type { ChartCardProps } from "./types"

defineOptions({ name: "ChartCard" })

// 事件
const emit = defineEmits<{
    (event: "card-click", label: string): void
}>()

// 定义 props
const {
    name = "card",
    label = "卡片图",
    value = 123456,
    width = 100,
    height = 62,
    bgColor = "",
    isAmountFen = false,
    isClick = false,
} = defineProps<ChartCardProps>()

// 元素引用
const cardRef = useTemplateRef<HTMLDivElement>("cardRef")

// 计算并设置 CSS 变量
const calcCssVars = () => {
    if (!cardRef.value) return

    // 在 cardRef 上设置高度和宽度的 css 变量
    cardRef.value.style.setProperty("--card-width", `${width}px`)
    cardRef.value.style.setProperty("--card-height", `${height}px`)
    if (bgColor) {
        cardRef.value.style.setProperty("--bg-color", bgColor)
    }
}

// 处理点击事件
const handleClick = () => {
    if (isClick) {
        emit("card-click", name)
    }
}

onMounted(async () => {
    await nextTick()
    calcCssVars()
})
</script>

<style lang="scss" scoped>
%card-container-common {
    width: var(--card-width);
    min-height: var(--card-height);
    background-color: var(--bg-color, var(--jpz-bg-color));
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 20px 24px;
    font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
    border-top: 3px solid var(--jpz-border-color-lighter);
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;

    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
        border-top-color: var(--jpz-text-color-placeholder);
        transform: translateY(-2px);
    }

    .value {
        font-size: 28px;
        font-weight: 700;
        color: var(--jpz-text-color-primary);
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
    }

    .label {
        font-size: 13px;
        font-weight: 500;
        color: var(--jpz-text-color-secondary);
        margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
}
.card-container {
    @extend %card-container-common;
}

.card-container-click {
    @extend %card-container-common;
    cursor: pointer;

    &:hover {
        border-top-color: var(--jpz-text-color-primary);
    }
}
</style>
