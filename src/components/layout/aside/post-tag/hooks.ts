/*
 * FilePath    : blog-client-nuxt\src\components\layout\aside\post-tag\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取文章标签数据并兼容空接口结果
 */

import { reactive } from "vue"

import { type PostTag } from "@/api/postTag/view"
import { viewPostTagTopNAPI } from "@/api/postTag/viewPostTagTopN"
import { viewPostTagTopNAdminAPI } from "@/api/postTag/viewPostTagTopNAdmin"
import { ResponseCode } from "@/api/response"
import { useStatusStore } from "@/stores/status"
import { sortPostTagsByCount } from "@/utils/tagSort"

/**
 * 按当前页面口径对标签列表排序
 * @param tags - 待排序的标签列表
 * @param isAdmin - 是否使用管理员口径
 * @returns 新的排序结果, 不修改原始数组
 */
export function sortPostTagsByActiveCount(tags: PostTag[], isAdmin: boolean): PostTag[] {
    const countKey = isAdmin ? "post_count_admin" : "post_count"
    return sortPostTagsByCount(tags, countKey)
}

/**
 * 规范化文章标签接口数据, 避免空站点返回空值时进入排序逻辑.
 * @param data - 接口返回的原始标签数据.
 * @returns 可安全消费的标签数组.
 */
export function normalizePostTags(data: unknown): PostTag[] {
    return Array.isArray(data) ? (data as PostTag[]) : []
}

/**
 * 获取文章标签数据
 * @param isAdmin - 是否使用管理员标签口径
 * @returns 标签列表与加载方法
 */
export function usePostTagData(isAdmin: boolean) {
    const statusStore = useStatusStore()

    const items = reactive<PostTag[]>([])

    const topNAPI = isAdmin ? viewPostTagTopNAdminAPI : viewPostTagTopNAPI

    // 获取标签 TopN
    const getTagTopN = async () => {
        // 获取标签列表
        await topNAPI().then((res) => {
            if (res.data.code === ResponseCode.PostTagViewTopNSuccess) {
                const sortedTags = sortPostTagsByActiveCount(normalizePostTags(res.data.data), isAdmin)
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
