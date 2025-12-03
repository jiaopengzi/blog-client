/**
 * FilePath    : blog-client-dev\src\components\layout\aside\post-tag\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取文章标签数据
 */

import { reactive } from "vue"

import { type PostTag } from "@/api/postTag/view"
import { viewPostTagTopNAPI } from "@/api/postTag/viewPostTagTopN"
import { viewPostTagTopNAdminAPI } from "@/api/postTag/viewPostTagTopNAdmin"
import { ResponseCode } from "@/api/response"
import { useStatusStore } from "@/stores/status"

// 设置文章详情
export function usePostTagData(isAdmin: boolean) {
    const statusStore = useStatusStore()

    const items = reactive<PostTag[]>([])

    const topNAPI = isAdmin ? viewPostTagTopNAdminAPI : viewPostTagTopNAPI

    // 获取分页用户
    const getTagTopN = async () => {
        // 获取标签列表
        await topNAPI().then((res) => {
            if (res.data.code === ResponseCode.PostTagViewTopNSuccess) {
                Object.assign(items, res.data.data)

                // 设置状态
                statusStore.setHasDataPostTag(items.length > 0)
            }
        })
    }

    return {
        items,
        getTagTopN,
    }
}
