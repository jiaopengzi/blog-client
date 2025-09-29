<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树编辑
-->
<template>
    <div class="custom-tree-container">
        <el-tree
            :props="{ class: customNodeClass }"
            style="width: 600px"
            :data="localTreeList"
            node-key="id"
            default-expand-all
            draggable
            highlight-current
            :expand-on-click-node="false"
            @node-drop="handleDrop"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node-content">
                    <VideoTocItem
                        :class="data.isChapter ? 'tree-chapter' : 'tree-video'"
                        :is-show-order="!data.isChapter"
                        :order-total="videoTotal"
                        :order="data.videoOrder"
                        :text="data.label"
                        @finish-edit="(val: string) => finishEdit(val, node, data)"
                    />
                    <div class="btns">
                        <el-button class="btn-chapter" v-if="data.isChapter" type="primary" @click="appendChapter(data)"> 章节 </el-button>
                        <el-button class="btn-video" v-if="data.isChapter" type="primary" @click="appendVideo(node)"> 视频 </el-button>
                        <el-button class="btn-delete" type="danger" @click="removeNode(node, data)"> 删除 </el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </div>

    <!-- 媒体文件选择弹窗 -->
    <SelectMedia v-if="mediaDialogVisible" v-model="mediaDialogVisible" @insert-data="selectData" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import type { TableData } from "@/components/common/base-table"
import SelectMedia from "@/components/common/media-select/index.vue"

import VideoTocItem from "../video-toc-item"
import type { Data, Node, Tree, TreeProps } from "./types"

defineOptions({ name: "VideoTocTree" })

// 定义 props
const {
    treeList = [], // 目录树数据
} = defineProps<TreeProps>()

// 事件
const emit = defineEmits<{
    (event: "tree-update", val: Tree[]): void
}>()

const customNodeClass = "custom-tree-node" // 自定义节点类名
const mediaDialogVisible = ref(false) // 视频文件选择弹窗
const localTreeList = ref<Tree[]>(treeList) // 本地目录树数据
const targetNode = ref<Node | null>(null) // 目标节点(添加视频时用到)

// 选择媒体文件后的回调
const selectData = (data: TableData[]) => {
    // 如果目标节点不存在, 则插入到根节点
    if (!targetNode.value) {
        return
    }

    // 遍历数据, 只处理视频类型
    for (const item of data) {
        if (!("file_type" in item) || !item.file_type.startsWith("video")) continue

        // 视频类型
        const type = item.file_type.split("/")[1]

        // 动态计算id
        const id = calcMaxId(localTreeList.value) + 1

        // 基础节点
        const baseNode: Tree = {
            id,
            label: item.file_name_display,
            videoType: item.is_generate_hls ? "hls" : type,
            isChapter: false,
        }

        if (item.is_generate_hls) {
            // HLS 视频
            baseNode.videoId = item.file_name.split(".")[0]
        } else {
            // 非 HLS 视频
            baseNode.videoSrc = item.url_belong + item.path
        }

        // 插入到目标节点下
        if (!targetNode.value.data.children) {
            targetNode.value.data.children = []
        }

        targetNode.value.data.children.push(baseNode)

        orderLocalTreeList()
    }

    mediaDialogVisible.value = false
}

// 递归计算最大 id
const calcMaxId = (list: Tree[]): number => {
    let maxId = 0
    list.forEach((item) => {
        if (item.id > maxId) {
            maxId = item.id
        }
        if (item.children && item.children.length > 0) {
            const childMaxId = calcMaxId(item.children)
            if (childMaxId > maxId) {
                maxId = childMaxId
            }
        }
    })
    return maxId
}

// 添加章节
const appendChapter = (data: Data) => {
    // 动态计算id
    const id = calcMaxId(localTreeList.value) + 1

    const newChild: Tree = { id, label: "章节", isChapter: true, children: [] }
    if (!data.children) {
        data.children = []
    }
    data.children.push(newChild)
    localTreeList.value = [...localTreeList.value]
    orderLocalTreeList()

    emit("tree-update", localTreeList.value)
}

// 添加视频
const appendVideo = (node: Node) => {
    // 打开媒体文件选择弹窗
    mediaDialogVisible.value = true
    targetNode.value = node
}

// 删除节点
const removeNode = (node: Node, data: Data) => {
    const parent = node.parent

    // 如果是根节点, 不能删除
    if (parent?.data.length === 1 && localTreeList.value.length === 1) {
        return
    }

    const children: Tree[] = parent?.data.children || parent?.data

    const index = children.findIndex((d) => d.id === data.id)
    children.splice(index, 1)
    localTreeList.value = [...localTreeList.value]
    orderLocalTreeList()

    emit("tree-update", localTreeList.value)
}

// 完成编辑(失焦或按回车)
const finishEdit = (val: string, node: Node, data: Data) => {
    if (val && val.trim() !== data.label) {
        data.label = val.trim()
        localTreeList.value = [...localTreeList.value]
        emit("tree-update", localTreeList.value)
    }
}

// 给目录树重新排序
const orderLocalTreeList = () => {
    let orderAll = 1
    let orderVideo = 1
    const orderNode = (nodes: Tree[]) => {
        for (const node of nodes) {
            if (node.isChapter) {
                // 只给视频节点设置 order
                node.id = orderAll++
                if (node.children && node.children.length > 0) {
                    orderNode(node.children)
                }
            } else {
                node.videoOrder = orderVideo++
            }
        }
    }

    orderNode(localTreeList.value)
}

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

// 处理节点拖拽
const handleDrop = () => {
    localTreeList.value = [...localTreeList.value]
    orderLocalTreeList()
    emit("tree-update", localTreeList.value)
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
