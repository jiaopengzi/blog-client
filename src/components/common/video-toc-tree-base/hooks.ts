/*
 * FilePath    : blog-client\src\components\common\video-toc-tree-base\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { computed, type Ref, ref } from "vue"

import type { TableData } from "@/components/common/base-table"
import { MediaTypes } from "@/components/player"

import type { Node, Tree, VideoTocMapByFileIdHash, VideoTocMapByOrder } from "./types"

export function useVideoTocTree(localTreeList: Ref<Tree[]>) {
    const customNodeClass = "custom-tree-node" // 自定义节点类名
    const mediaDialogVisible = ref(false) // 视频文件选择弹窗
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
            const type = item.file_type.split("/")[1] as MediaTypes

            // 动态计算id
            const id = calcMaxId(localTreeList.value) + 1

            // 基础节点
            const baseNode: Tree = {
                id,
                label: item.file_name_display,
                video_type: item.is_generate_hls ? MediaTypes.HLS : type,
                is_chapter: false,
                is_free: item.is_free,
                file_id_hash: item.file_id_hash,
            }

            // 非 HLS 视频, 则设置视频地址
            if (!item.is_generate_hls) {
                baseNode.video_src = item.url_belong + item.path
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

    // 添加视频
    const appendVideo = (node: Node) => {
        // 打开媒体文件选择弹窗
        mediaDialogVisible.value = true
        targetNode.value = node
    }

    // 给目录树重新排序
    const orderLocalTreeList = () => {
        let orderAll = 1
        let orderVideo = 1
        const orderNode = (nodes: Tree[]) => {
            for (const node of nodes) {
                // 设置所有节点的 id
                node.id = orderAll++

                if (!node.is_chapter) {
                    // 设置视频节点的 videoOrder
                    node.video_order = orderVideo++
                }

                // 递归子节点
                if (node.children && node.children.length > 0) {
                    orderNode(node.children)
                }
            }
        }

        orderNode(localTreeList.value)
    }

    // 计算视频总数
    const calcVideoTotal = (list: Tree[]) => {
        // 初始值
        let total = 0

        // 定义递归函数
        const countVideos = (nodes: Tree[]) => {
            for (const node of nodes) {
                if (node.is_chapter && node.children && node.children.length > 0) {
                    countVideos(node.children)
                } else if (!node.is_chapter) {
                    total++
                }
            }
        }

        // 开始递归
        countVideos(list)

        // 返回总数
        return total
    }

    // 视频总数
    const videoTotal = computed(() => {
        return calcVideoTotal(localTreeList.value)
    })

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

    // 将 localTreeList 转成 map (键为 videoOrder), 同时返回所有视频的 videoOrder 列表(已去重且升序)
    const covertToMap = (
        list: Tree[],
    ): { mapByFileIdHash: VideoTocMapByOrder; mapByOrder: VideoTocMapByOrder; videoOrders: number[]; fileIdHashList: string[] } => {
        // 初始化结果
        const mapByFileIdHash: VideoTocMapByFileIdHash = {}
        const mapByOrder: VideoTocMapByOrder = {}
        const videoOrders: number[] = []
        const fileIdHashLList: string[] = []

        // 递归遍历节点
        const traverse = (nodes: Tree[]) => {
            for (const node of nodes) {
                // 只处理视频节点
                if (!node.is_chapter && node.file_id_hash && node.video_order !== undefined && node.video_order !== null) {
                    mapByFileIdHash[node.file_id_hash] = node
                    mapByOrder[node.video_order] = node
                    videoOrders.push(node.video_order)
                    fileIdHashLList.push(node.file_id_hash)
                }

                // 递归子节点
                if (node.children && node.children.length > 0) {
                    traverse(node.children)
                }
            }
        }

        // 开始递归
        traverse(list)

        // 去重并排序，方便后续按顺序处理
        const uniqueOrders = Array.from(new Set(videoOrders)).sort((a, b) => a - b)

        // 去重 fileIdHash 列表
        const uniqueFileIdHashList = Array.from(new Set(fileIdHashLList))

        return { mapByFileIdHash, mapByOrder, videoOrders: uniqueOrders, fileIdHashList: uniqueFileIdHashList }
    }

    return {
        customNodeClass,
        mediaDialogVisible,
        selectData,
        appendVideo,
        orderLocalTreeList,
        calcVideoTotal,
        videoTotal,
        calcMaxId,
        covertToMap,
    }
}
