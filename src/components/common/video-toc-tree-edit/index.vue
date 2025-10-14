<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树编辑
-->
<template>
    <VideoTocTreeBase :tree-list="treeList" :draggable="true" :show-btns="true" :is-edit="true" :is-expand-all="true" @tree-update="handleTreeUpdate" />
</template>

<script lang="ts" setup>
import { type Tree } from "../video-toc-tree-base"
import VideoTocTreeBase from "../video-toc-tree-base/index.vue"

defineOptions({ name: "VideoTocTreeEdit" })

// 定义 props
const {
    treeList = [], // 目录树数据
} = defineProps<{
    treeList?: Tree[]
}>()

// 事件
const emit = defineEmits<{
    (event: "tree-update", val: Tree[], videoFileIdHashList: string[]): void
}>()

// 监听目录树变化
const handleTreeUpdate = (val: Tree[], videoFileIdHashList: string[]) => {
    emit("tree-update", val, videoFileIdHashList)
}
</script>

<style lang="scss" scoped></style>
