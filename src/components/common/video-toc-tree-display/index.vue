<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-display\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树展示
-->
<template>
    <VideoTocTreeBase
        :key="key"
        :tree-list="treeList"
        :draggable="false"
        :show-btns="false"
        :is-edit="false"
        :is-expand-all="true"
        :current-node-key="currentNodeKey"
        @video-select="handleTreeSelect"
    />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import VideoTocTreeBase, { type Data, type Tree } from "../video-toc-tree-base"

defineOptions({ name: "VideoTocTreeDisplay" })

// 定义 props
const {
    treeList = [], // 目录树数据
    currentNodeKey, // 当前选中节点的 key
} = defineProps<{
    treeList?: Tree[]
    currentNodeKey?: string | number
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
<style scoped lang="scss">
/* 仅用于展示模式的树样式穿透，实现暗色剧院感和交互效果 */
:deep(.el-tree) {
    background-color: transparent;
    color: var(--jpz-text-color-primary);
}

:deep(.el-tree-node) {
    margin: 4px 0;
}

:deep(.el-tree-node__content) {
    background-color: transparent !important; // override element plus default hover
    padding: 0 4px;
    height: auto;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--jpz-bg-color-page) !important;
        border-color: var(--jpz-border-color-hover);
        box-shadow: var(--jpz-box-shadow-light);

        .tree-video {
            color: var(--jpz-color-primary);
        }
    }
}

/* 覆盖 el-tree 的当前选中节点高亮样式 */
:deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: var(--jpz-bg-color-page) !important;
    border-color: var(--jpz-color-primary);
    color: var(--jpz-color-primary);
    box-shadow: var(--jpz-box-shadow-light);

    .video-toc-item {
        border-left: 3px solid var(--jpz-color-primary);
        padding-left: 9px; // 原来是 12px，减去 3px border，保持内容对齐
        border-radius: 2px 0 0 2px;
    }

    .tree-video {
        color: var(--jpz-color-primary);
        font-weight: 600;
    }
}

:deep(.tree-chapter) {
    font-size: 15px;
    font-weight: bold;
    color: var(--jpz-text-color-primary);
    margin-top: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--jpz-border-color);
}

:deep(.tree-video) {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    cursor: pointer;
    transition: color 0.3s ease;
}
</style>
