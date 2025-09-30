<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-display\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树展示
-->
<template>
    <VideoTocTreeBase :key="key" :tree-list="treeList" :draggable="false" :show-btns="false" :is-edit="false" @video-select="handleTreeSelect" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import VideoTocTreeBase, { type Data, type Tree } from "../video-toc-tree-base"

defineOptions({ name: "VideoTocTree" })

// 定义 props
const {
    treeList = [], // 目录树数据
} = defineProps<{
    treeList?: Tree[]
}>()

// 事件
const emit = defineEmits<{
    (event: "video-select", val: Data): void
}>()

// 强制刷新 key
const key = ref("initial-key")

// 监听 treeList 变化, 更新 key 以强制刷新组件
watch(
    () => treeList,
    () => {
        key.value = Math.random().toString(36).substring(2, 15)
    },
)

// 目录选择
const handleTreeSelect = (val: Data) => {
    emit("video-select", val)
}
</script>
