/*
 * FilePath    : blog-client\src\router\middleware\home.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 首页状态更新
 */

import { type RouteLocationNormalized } from "vue-router"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { useStatusStore } from "@/stores/status"
import { parseRouteQuery } from "@/utils/queryParam"

import { RouteNames } from "../types"

/**
 * home 页面根据路由参数更新状态
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const homeMiddleware = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.name === RouteNames.Home) {
        const statusStore = useStatusStore()
        const { hasKeyWord, hasPostDetail, result } = await parseRouteQuery<ViewPostByIDRequest>(to.query)

        if (hasKeyWord) {
            await statusStore.setSearch()
        } else if (hasPostDetail) {
            await statusStore.setPostId(result.post_id)
            await statusStore.setAnchorHash(to.hash)
            await statusStore.setPostDetail()
        } else {
            await statusStore.setHome()
        }
    }

    return true
}
