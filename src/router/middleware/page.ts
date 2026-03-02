/*
 * FilePath    : blog-client\src\router\middleware\page.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义页面
 */

import { type RouteLocationNormalized } from "vue-router"

import { pagePathToIDAPI, type PagePathToIDRequest } from "@/api/post/pagePathToID"
import { ResponseCode } from "@/api/response"
import { useOptionsStore } from "@/stores/options"
import { useStatusStore } from "@/stores/status"

import { RouteNames } from "../types"

/**
 * page 页面根据路由参数更新状态
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const pageMiddleware = async (to: RouteLocationNormalized) => {
    if (to.name === RouteNames.Page) {
        const statusStore = useStatusStore()
        const optionsStore = useOptionsStore()

        // 获取路由最后一个路径段
        const lastPathSegment = to.path.split("/").pop()
        if (!lastPathSegment) {
            // 如果没有路径段，重置状态并初始化头部信息
            await statusStore.setHome()
            await optionsStore.initHead()
            return false
        }

        // 拿到文章 ID
        const requestData: PagePathToIDRequest = { slug: lastPathSegment }
        const res = await pagePathToIDAPI(requestData)
        if (res.data.code === ResponseCode.PageIDSuccess) {
            await statusStore.setPostId(res.data.data)
            await statusStore.setCustomPage()
            return true
        }

        // 页面不存在, 重定向到404, 保留原始 URL 路径
        return { name: RouteNames.NotFound, params: { pathMatch: to.path.substring(1).split("/") } }
    }

    return true
}
