/*
 * FilePath    : blog-client\src\components\hooks\useRootUtils\route.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 路由相关
 */

import { type Reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { type QueryParamsOptions } from "@/api/request"
import { routerPushByParams } from "@/router"
import { RouteNames } from "@/router"
import { parseRouteQuery } from "@/utils/queryParam"

import type { QueryParams, QueryParamsKey } from "./types"

export function useRootRoute<T extends QueryParams>(
    queryParams: Reactive<T>, // 查询参数
    options?: QueryParamsOptions<T>, // 请求参数选项
) {
    const route = useRoute()
    const router = useRouter()

    const hasPaginationInURL = ref(false) // URL 中是否有分页参数

    // 更新查询参数
    const updateRouterPush = async () => {
        // 遍历 options.noRouteKeys 中的参数, 如果 queryParams 存在该 key 则删除, 不参与路由
        if (options?.noRouteKeys) {
            options.noRouteKeys.forEach((key) => {
                if (key in queryParams) {
                    delete queryParams[key as QueryParamsKey]
                }
            })
        }

        // 路由中不需要高亮字段和前后标签
        await routerPushByParams(router, RouteNames.Home, queryParams)
    }

    // 更新查询参数
    const updateQueryParams = async () => {
        const { hasQuery, hasPagination, result } = await parseRouteQuery(route.query, options as QueryParamsOptions<T>)

        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as keyof typeof queryParams])
        if (hasQuery) {
            Object.assign(queryParams, result)
        }

        hasPaginationInURL.value = hasPagination
    }

    const clearParamsExcept = (fieldsToKeep: QueryParamsKey[]) => {
        const keysToClear: QueryParamsKey[] = [
            "key_word",
            "year",
            "month",
            "post_author",
            "post_category_id",
            "post_category_slug",
            "post_tag_id",
            "post_tag_slug",
            "current_page",
            "page_size",

            "post_id",

            // "highlight_fields",
            // "pre_tags",
            // "post_tags",
        ]

        keysToClear.forEach((key) => {
            if (!fieldsToKeep.includes(key)) {
                delete queryParams[key as QueryParamsKey]
            }
        })
    }

    return {
        hasPaginationInURL,
        updateRouterPush,
        updateQueryParams,
        clearParamsExcept,
    }
}
