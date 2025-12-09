<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-base\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树基础
-->
<template>
    <div class="custom-tree-container">
        <el-tree
            ref="treeRef"
            :props="{ class: customNodeClass }"
            style="width: 100%"
            :data="localTreeList"
            node-key="id"
            :default-expand-all="isExpandAll"
            highlight-current
            :draggable="draggable"
            :expand-on-click-node="true"
            :current-node-key="currentNodeKey"
            @node-drop="handleDrop"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node-content">
                    <VideoTocItem
                        :class="data.is_chapter ? 'tree-chapter' : 'tree-video'"
                        :is-show-order="!data.is_chapter"
                        :order-total="videoTotal"
                        :order="data.video_order"
                        :text="data.label"
                        :is-edit="isEdit"
                        @finish-edit="(val: string) => finishEdit(val, node, data)"
                        @click="handleClick(data)"
                    />
                    <div class="btns" v-if="showBtns">
                        <el-button class="btn-chapter" v-if="data.is_chapter" type="primary" @click="appendChapter(data)"> 章节 </el-button>
                        <el-button class="btn-video" v-if="data.is_chapter" type="primary" @click="appendVideo(node)"> 视频 </el-button>
                        <el-button class="btn-delete" type="danger" @click="removeNode(node, data)"> 删除 </el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </div>

    <!-- 媒体文件选择弹窗 -->
    <SelectMedia v-if="mediaDialogVisible && showBtns" v-model="mediaDialogVisible" @insert-data="updateNode" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import type { TableData } from "@/components/common/base-table"
import SelectMedia from "@/components/common/media-select/index.vue"

import VideoTocItem from "../video-toc-item"
import { useVideoTocTree } from "./hooks"
import type { Data, Node, Tree, TreeProps } from "./types"

defineOptions({ name: "VideoTocTreeBase" })

// 定义 props
const {
    treeList = [], // 目录树数据
    draggable = true, // 是否可拖拽
    showBtns = true, // 是否显示操作按钮
    isEdit = true, // 是否可编辑
    isExpandAll = true, // 是否默认展开所有节点
    currentNodeKey, // 当前选中节点的 key
} = defineProps<TreeProps>()

// 事件
const emit = defineEmits<{
    (event: "tree-update", val: Tree[], videoFileIdHashList: string[]): void // 目录树更新
    (event: "video-select", val: Data): void // 选择视频文件
    (event: "delete-root"): void // 删除根节点
}>()

const localTreeList = ref<Tree[]>(treeList) // 本地目录树数据

// hooks
const { customNodeClass, mediaDialogVisible, selectData, appendVideo, orderLocalTreeList, videoTotal, calcMaxId, covertToMap } = useVideoTocTree(localTreeList)

// 监听 treeList 变化, 更新组件
watch(
    () => treeList,
    (newVal) => {
        localTreeList.value = newVal
        orderLocalTreeList()
    },
)

// 提交目录树变化
const emitTreeUpdate = () => {
    localTreeList.value = [...localTreeList.value]
    orderLocalTreeList()
    const { fileIdHashList } = covertToMap(localTreeList.value)
    emit("tree-update", localTreeList.value, fileIdHashList)
}

// 添加章节
const appendChapter = (data: Data) => {
    // 动态计算id
    const id = calcMaxId(localTreeList.value) + 1

    const newChild: Tree = { id, label: "章节", is_chapter: true, children: [] }
    if (!data.children) {
        data.children = []
    }
    data.children.push(newChild)

    emitTreeUpdate()
}

// 删除节点
const removeNode = (node: Node, data: Data) => {
    const parent = node.parent

    // 如果是根节点，且只有一个节点，触发删除根节点事件
    if (parent?.data.length === 1 && localTreeList.value.length === 1) {
        emit("delete-root")
    }

    const children: Tree[] = parent?.data.children || parent?.data

    const index = children.findIndex((d) => d.id === data.id)
    children.splice(index, 1)

    emitTreeUpdate()
}

// 完成编辑(失焦或按回车)
const finishEdit = (val: string, node: Node, data: Data) => {
    if (val && val.trim() !== data.label) {
        data.label = val.trim()

        emitTreeUpdate()
    }
}

// 更新并插入数据
const updateNode = (data: TableData[]) => {
    selectData(data)
    emitTreeUpdate()
}

// 处理节点拖拽
const handleDrop = () => {
    emitTreeUpdate()
}

// 点击处理
const handleClick = (data: Data) => {
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

:deep(.el-tree-node__content) {
    height: 100%;
}

.custom-tree-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 8px;
}

.custom-tree-node-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 4px;
    min-height: 32px;
}

.btns {
    display: flex;

    .btn-chapter,
    .btn-video,
    .btn-delete {
        padding: 0px 4px;
        font-size: 12px;
        font-weight: 400;
        height: 24px;
        margin: 0 4px;
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
