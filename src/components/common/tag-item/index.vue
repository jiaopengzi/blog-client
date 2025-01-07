<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-03 20:48:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-22 20:38:23
 * @FilePath     : \blog-client\src\components\common\tag-item\index.vue
 * @Description  : 标签元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-tag
        :key="tag.data.name"
        class="tag-item"
        effect="dark"
        :round="false"
        @click="handleClick(tag)"
        :style="[{ 'background-color': tag.color.bgColor }, { color: tag.color.color }]"
    >
        {{ display }}
    </el-tag>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { type PostTag } from "@/api/postTag/view"

import type { Tag, TagColor } from "./types"

defineOptions({ name: "TagItem" })

const { tagData, isAdmin = false } = defineProps<{
    isAdmin?: boolean
    tagData: PostTag
}>()

const emit = defineEmits<{
    (event: "click", tagItemData: PostTag): void
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

const tag: Tag = {
    data: tagData,
    color: generateItemColor(),
}

// 标签显示
const display = computed(() => {
    if (isAdmin) {
        return `${tag.data.name}(${tag.data.post_count_admin})`
    } else {
        return `${tag.data.name}(${tag.data.post_count})`
    }
})

// 点击标签跳转到标签页面
const handleClick = (clickedItem: Tag) => {
    emit("click", clickedItem.data)
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
