<!--
 * FilePath    : blog-client-nuxt\src\components\common\tag-item-base\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 基础标签组件
-->

<template>
    <el-tag
        :key="tag.id"
        class="tag-item"
        effect="dark"
        :round="false"
        @click="handleClick(tag.id)"
        :style="[{ 'background-color': tag.color.bgColor }, { color: tag.color.color }]"
    >
        {{ tag.display }}
    </el-tag>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from "vue"

import type { Tag, TagBase, TagColor } from "./types"

defineOptions({ name: "TagItemBase" })

const { tagBase } = defineProps<{
    tagBase: TagBase
}>()

const emit = defineEmits<{
    (event: "click-item", id: string): void
}>()

/**
 * hashStringToSeed 将字符串哈希为 32 位无符号整数种子(feature02 水合修复).
 * 原实现使用 Math.random() 生成颜色, SSR 与客户端生成结果不一致, 产生 hydration style mismatch;
 * 改为按标签 id+display 确定性生成, 颜色稳定且双端一致.
 * @param str 待哈希字符串.
 * @returns 32 位无符号整数种子.
 */
const hashStringToSeed = (str: string): number => {
    let hash = 2166136261
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i)
        hash = Math.imul(hash, 16777619)
    }
    return hash >>> 0
}

/**
 * seededChannel 从种子确定性生成 0-255 的颜色通道值(乘同余伪随机序列, 观感与原先随机色一致).
 * @param seed 哈希种子.
 * @param index 通道序号.
 * @returns 0-255 的通道值.
 */
const seededChannel = (seed: number, index: number): number => {
    const value = Math.imul(seed ^ (index * 0x9e3779b1), 2654435761) >>> 0
    return value % 0xff
}

// tag 字体颜色和背景色生成函数(按种子确定性生成)
const generateItemColor = (seed: number, a: number = 0.8): TagColor => {
    const r = seededChannel(seed, 1) // 确定性生成 RGB 颜色中的 r 值
    const g = seededChannel(seed, 2) // 确定性生成 RGB 颜色中的 g 值
    const b = seededChannel(seed, 3) // 确定性生成 RGB 颜色中的 b 值
    const L = Math.round(((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * 100) // 计算亮度公式

    const bgColor = "rgba(" + r + "," + g + "," + b + "," + a + ")" // 设置背景色变量
    const color = L > 50 ? "#222" : "#ddd" // 设置文字颜色变量

    return { color: color, bgColor: bgColor }
}

const tag: ComputedRef<Tag> = computed(() => {
    const seed = hashStringToSeed(String(tagBase.id ?? "") + ":" + String(tagBase.display ?? ""))
    return {
        ...tagBase,
        color: generateItemColor(seed),
    }
})

// 点击标签跳转到标签页面
const handleClick = (id: string) => {
    emit("click-item", id)
}
</script>

<style scoped lang="scss">
.tag-item {
    font-size: 13px;
    min-width: 50px;
    margin-top: 5px;
    margin-right: 5px;
    padding: 3px 3px;
    border: none;

    &:hover {
        cursor: pointer;
    }
}
</style>
