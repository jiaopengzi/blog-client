/*
 * FilePath    : blog-client\src\components\hooks\usePostDetail\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具
 */

import { type Reactive } from "vue"
import { useRoute, useRouter } from "vue-router"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { routerPushByParams } from "@/router"
import { RouteNames } from "@/router"
import { parseRouteQuery } from "@/utils/queryParam"

export function useUtils(
    queryParams: Reactive<ViewPostByIDRequest>, // 查询参数
) {
    const route = useRoute()
    const router = useRouter()

    // 更新查询参数
    const updateRouterPush = async () => {
        await routerPushByParams(router, RouteNames.Home, queryParams)
    }

    // 更新查询参数
    const updateQueryParams = async () => {
        console.log("============>detail", route.query)
        const { hasQuery, result } = await parseRouteQuery(route.query)
        if (hasQuery) {
            Object.assign(queryParams, result)
        }
    }

    // 生成面包屑路径
    const generateBreadcrumbPath = () => {
        return router.resolve({
            name: RouteNames.Home,
            query: queryParams,
        }).href
    }

    return {
        updateRouterPush,
        updateQueryParams,
        generateBreadcrumbPath,
    }
}
