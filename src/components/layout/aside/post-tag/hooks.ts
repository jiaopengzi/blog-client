/**
 * FilePath    : blog-client\src\components\layout\aside\post-tag\hooks.ts
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
import { sortPostTagsByCount } from "@/utils/postTagSort"

/**
 * 按当前页面口径对标签列表排序.
 * @param tags - 待排序的标签列表.
 * @param isAdmin - 是否使用管理员口径.
 * @returns 新的排序结果, 不修改原始数组.
 */
export function sortPostTagsByActiveCount(tags: PostTag[], isAdmin: boolean): PostTag[] {
    const countKey = isAdmin ? "post_count_admin" : "post_count"
    return sortPostTagsByCount(tags, countKey)
}

/**
 * 获取文章标签数据.
 * @param isAdmin - 是否使用管理员标签口径.
 * @returns 标签列表与加载方法.
 */
export function usePostTagData(isAdmin: boolean) {
    const statusStore = useStatusStore()

    const items = reactive<PostTag[]>([])

    const topNAPI = isAdmin ? viewPostTagTopNAdminAPI : viewPostTagTopNAPI

    // 获取分页用户
    const getTagTopN = async () => {
        // 获取标签列表
        await topNAPI().then((res) => {
            if (res.data.code === ResponseCode.PostTagViewTopNSuccess) {
                const sortedTags = sortPostTagsByActiveCount(res.data.data, isAdmin)
                items.splice(0, items.length, ...sortedTags)

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
