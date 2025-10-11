/*
 * FilePath    : blog-client\src\components\common\pay-video\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { computed, type Ref, ref } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { getUserPostVideoProgressAPI, type GetUserPostVideoProgressRequest, type GetUserPostVideoProgressResponse } from "@/api/video/getUserPostVideoProgress"
import { getVideosIsFreeAPI, type GetVideosIsFreeRequest, type GetVideosIsFreeResponse } from "@/api/video/getVideosIsFree"
import type { TableData } from "@/components/common/base-table"
import { Language, MediaTypes, type PlayerState, PlayerStateManager } from "@/components/player"

import { useVideoTocTree } from "../video-toc-tree-base"

export function usePayVideo(localTreeList: Ref<PostVideoTocTree[]>) {
    // hooks
    const treeMap = ref<{ [key: number]: PostVideoTocTree }>({})
    const treeVideoOrders = ref<number[]>([])
    const { videoTotal, covertToMap } = useVideoTocTree(localTreeList)

    const manager = new PlayerStateManager()
    const state = manager.getState()

    // 更新视频是否免费
    async function updateVideosIsFree() {
        const fileIdHashList: string[] = []

        // 遍历 treeMap 拿到所有的视频 fileIdHash
        for (const key in treeMap.value) {
            const node = treeMap.value[key]
            if (node?.file_id_hash) {
                fileIdHashList.push(node.file_id_hash)
            }
        }

        if (fileIdHashList.length === 0) {
            return
        }

        const reqData: GetVideosIsFreeRequest = {
            file_id_hash_list: fileIdHashList,
        }

        const res = await getVideosIsFreeAPI(reqData)

        if (res.data.code === ResponseCode.GetVideosIsFreeSuccess) {
            const isFreeData = res.data.data
            updateTreeIsFree(isFreeData)
        }
    }

    // 更新目录树的是否免费状态
    function updateTreeIsFree(isFreeData: GetVideosIsFreeResponse[]) {
        // 转换为 map 结构
        const isFreeMap: { [key: string]: boolean } = {}
        for (const item of isFreeData) {
            isFreeMap[item.file_id_hash] = item.is_free
        }

        // 递归更新 localTreeList
        function updateNodeList(nodeList: PostVideoTocTree[]) {
            for (const node of nodeList) {
                if (node.file_id_hash && node.file_id_hash in isFreeMap) {
                    node.is_free = isFreeMap[node.file_id_hash]
                }
                if (node.children && node.children.length > 0) {
                    updateNodeList(node.children)
                }
            }
        }

        updateNodeList(localTreeList.value)
    }

    return {
        treeMap,
        treeVideoOrders,
        videoTotal,
        covertToMap,
        manager,
        state,
        updateVideosIsFree,
    }
}
