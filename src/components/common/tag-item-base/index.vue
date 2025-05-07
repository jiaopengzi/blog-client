<!--
 * @FilePath     : \blog-client\src\components\common\tag-item\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 标签组件
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

// tag 随机生成RGB颜色中的r值、g值、b值
const randomRgbItem = (): number => {
    return Math.floor(Math.random() * 0xff)
}

// tag 字体颜色和背景色生成函数
const generateItemColor = (a: number = 0.8): TagColor => {
    const r = randomRgbItem() // 随机生成RGB颜色中的r值
    const g = randomRgbItem() // 随机生成RGB颜色中的g值
    const b = randomRgbItem() // 随机生成RGB颜色中的b值
    const L = Math.round(((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * 100) // 计算亮度公式

    const bgColor = "rgba(" + r + "," + g + "," + b + "," + a + ")" // 设置背景色变量
    const color = L > 50 ? "#222" : "#ddd" // 设置文字颜色变量
    // let color = 'rgba(' + (255 - r) + ',' + (255 - g) + ',' + (255 - b) + ')'// 模仿 css mix-blend-mode: difference;

    return { color: color, bgColor: bgColor }
}

const tag: ComputedRef<Tag> = computed(() => {
    return {
        ...tagBase,
        color: generateItemColor(),
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
