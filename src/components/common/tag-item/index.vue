<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-03 20:48:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-07 10:35:17
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
        {{ tag.data.name + "(" + tag.data.post_count + ")" }}
    </el-tag>
</template>

<script lang="ts" setup>
import type { Tag, TagColor } from "@/components/common/tag-item"
import { type PostTag } from "@/api/postTag/view"

defineOptions({ name: "TagItem" })

const props = defineProps<{
    tagData: PostTag
}>()

const emit = defineEmits<{
    (event: "click", tagItemData: PostTag): void
}>()

const tag: Tag = {
    data: props.tagData,
    color: generateItemColor(),
}

// tag 随机生成RGB颜色中的r值、g值、b值
function randomRgbItem(): number {
    return Math.floor(Math.random() * 0xff)
}

// tag 字体颜色和背景色生成函数
function generateItemColor(a: number = 0.8): TagColor {
    let r = randomRgbItem() // 随机生成RGB颜色中的r值
    let g = randomRgbItem() // 随机生成RGB颜色中的g值
    let b = randomRgbItem() // 随机生成RGB颜色中的b值
    let L = Math.round(((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * 100) // 计算亮度公式

    let bgColor = "rgba(" + r + "," + g + "," + b + "," + a + ")" // 设置背景色变量
    let color = L > 50 ? "#222" : "#ddd" // 设置文字颜色变量
    // let color = 'rgba(' + (255 - r) + ',' + (255 - g) + ',' + (255 - b) + ')'// 模仿 css mix-blend-mode: difference;

    return { color: color, bgColor: bgColor }
}

// 点击标签跳转到标签页面
const handleClick = (clickedItem: Tag) => {
    emit("click", clickedItem.data)
    // console.log(clickedItem.data)
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
