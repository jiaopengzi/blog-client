/*
 * FilePath    : blog-client\src\router\middleware\postSlug.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章 slug 路由中间件
 */

import { type RouteLocationNormalized } from "vue-router"

import { postPathToIDAPI, type PostPathToIDRequest } from "@/api/post/postPathToID"
import { ResponseCode } from "@/api/response"

import { RouteNames } from "../types"

/**
 * 根据文章 slug 将路由转换为文章详情页所需的 post_id 查询参数.
 *
 * @param to - 即将进入的路由对象.
 * @returns 返回继续导航或重定向配置.
 */
export const postSlugMiddleware = async (to: RouteLocationNormalized) => {
    if (to.name !== RouteNames.PostSlug) {
        return true
    }

    const routeSlug = to.params.postSlug
    const postSlug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug
    if (!postSlug) {
        return { name: RouteNames.NotFound, params: { pathMatch: to.path.substring(1).split("/") } }
    }

    const requestData: PostPathToIDRequest = { slug: postSlug }
    const res = await postPathToIDAPI(requestData)

    if (res.data.code === ResponseCode.PostIDSuccess) {
        return {
            path: "/",
            query: { post_id: res.data.data },
            hash: to.hash,
            replace: true,
        }
    }

    return { name: RouteNames.NotFound, params: { pathMatch: to.path.substring(1).split("/") } }
}
