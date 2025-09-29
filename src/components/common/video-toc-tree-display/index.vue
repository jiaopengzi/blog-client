<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-display\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树展示
-->
<template>
    <div class="custom-tree-container">
        <el-tree
            :props="{ class: customNodeClass }"
            style="width: 600px"
            :data="localTreeList"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
        >
            <template #default="{ data }">
                <div class="custom-tree-node-content">
                    <VideoTocItem
                        :class="data.isChapter ? 'tree-chapter' : 'tree-video'"
                        :is-show-order="!data.isChapter"
                        :order-total="videoTotal"
                        :order="data.videoOrder"
                        :text="data.label"
                        :is-edit="false"
                        @dblclick="handleDblClick(data)"
                    />
                </div>
            </template>
        </el-tree>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import VideoTocItem from "../video-toc-item"
import type { Data, Tree, TreeProps } from "../video-toc-tree-edit"

defineOptions({ name: "VideoTocTreeDisplay" })

// 定义 props
const {
    treeList = [], // 目录树数据
} = defineProps<TreeProps>()

// 事件
const emit = defineEmits<{
    (event: "video-select", val: Data): void
}>()

const customNodeClass = "custom-tree-node" // 自定义节点类名
const localTreeList = ref<Tree[]>(treeList) // 本地目录树数据

// 计算视频总数
const videoTotal = computed(() => {
    let total = 0
    const countVideos = (nodes: Tree[]) => {
        for (const node of nodes) {
            if (node.isChapter && node.children && node.children.length > 0) {
                countVideos(node.children)
            } else if (!node.isChapter) {
                total++
            }
        }
    }
    countVideos(localTreeList.value)
    return total
})

// 双击处理
const handleDblClick = (data: Data) => {
    if (!data.isChapter) {
        emit("video-select", data)
    }
}
</script>

<style lang="scss" scoped>
:deep(.custom-tree-node) {
    width: 100%;
    margin: 12px 0;
}

.custom-tree-node-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.btns {
    display: flex;

    .btn-chapter,
    .btn-video,
    .btn-delete {
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 400;
    }
}

.tree-chapter {
    font-weight: bold;
    color: var(--jpz-text-color-primary);
}

.tree-video {
    color: var(--jpz-text-color-secondary);
}
</style>
