/*
 * FilePath    : blog-client-nuxt\src\components\hooks\useRootUtils\route.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 路由相关
 */

import { type Reactive, ref } from "vue"

import { type QueryParamsOptions } from "@/api/request"
import { routerPushByParams } from "@/router"
import { RouteNames } from "@/router"
import { parseRouteQuery } from "@/utils/queryParam"

import type { QueryParams, QueryParamsKey } from "./types"

export function useRootRoute<T extends QueryParams>(
    queryParams: Reactive<T>, // 查询参数
    options?: Reactive<QueryParamsOptions<T>>, // 请求参数选项
) {
    const route = useRoute()
    const router = useRouter()

    const hasPaginationInURL = ref(false) // URL 中是否有分页参数

    // 更新查询参数和路由
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
        await routerPushByParams(router, RouteNames.Home, queryParams, options?.hash)
    }

    // 从 URL 中解析参数
    const updateQueryParams = async () => {
        const { hasQuery, hasPagination, result } = await parseRouteQuery(route.query, options as QueryParamsOptions<T>)

        // URL 简写分页参数 (page/size) 是否存在于解析结果 (翻译前的原始判断)
        let hasPaginationShorthand = false

        // Nuxt 适配: persistKeys 中的参数 (如 /category/[slug] 注入的 post_category_slug)
        // 不随 URL query 清空——清空前先暂存、清空后回填
        const persisted: Record<PropertyKey, unknown> = {}
        const persistKeys = (options as QueryParamsOptions<T> | undefined)?.persistKeys ?? []
        persistKeys.forEach((key) => {
            if (key in queryParams) {
                persisted[key as PropertyKey] = (queryParams as unknown as Record<PropertyKey, unknown>)[key as PropertyKey]
            }
        })

        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as keyof typeof queryParams])
        if (hasQuery) {
            Object.assign(queryParams, result)

            // URL 简写与请求参数名映射: URL 采用 ?page= / ?size= 简写 (REST 最佳实践),
            // 请求参数名保持 current_page / page_size 不变 (后端接口不变)
            // 简写分页参数同样计入 hasPaginationInURL, 避免被视作"无分页"而触发无限滚动追加
            const shorthand = queryParams as unknown as Record<string, unknown>
            if (shorthand.page !== undefined && shorthand.page !== null) {
                queryParams.current_page = Number(shorthand.page)
                delete shorthand.page
                hasPaginationShorthand = true
            }
            if (shorthand.size !== undefined && shorthand.size !== null) {
                queryParams.page_size = Number(shorthand.size)
                delete shorthand.size
                hasPaginationShorthand = true
            }
        }
        Object.assign(queryParams, persisted)

        hasPaginationInURL.value = hasPagination || hasPaginationShorthand
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
