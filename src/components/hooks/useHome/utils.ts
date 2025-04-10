/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import { type Reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { type ViewPostRequest } from "@/api/post/view"
import { type QueryParamsOptions } from "@/api/request"
import { routerPushByParams } from "@/router"
import { RouteNames } from "@/router"
import { useStatusStore } from "@/stores/status"
import { parseRouteQuery } from "@/utils/queryParam"

import type { ViewPostResKey } from "./types"

export function useUtils(
    queryParams: Reactive<ViewPostRequest>, // 查询参数
    options?: QueryParamsOptions<ViewPostRequest>, // 请求参数选项
) {
    const route = useRoute()
    const router = useRouter()
    const statusStore = useStatusStore()

    const hasPaginationParamsInURL = ref(false) // URL 中是否有分页参数

    const paginationBlockVisibleCount = ref(1) // 分页块出现次数
    const pageSizeTemp = ref(10) // 临时每页显示条数

    // 更新查询参数
    const updateRouterPush = async () => {
        statusStore.setIsPostDetailUpdateRoute(false) //非详情页
        // 遍历 options.noRouteKeys 中的参数, 如果 queryParams 存在该 key 则删除, 不参与路由
        if (options?.noRouteKeys) {
            options.noRouteKeys.forEach((key) => {
                if (key in queryParams) {
                    delete queryParams[key as ViewPostResKey]
                }
            })
        }

        // 路由中不需要高亮字段和前后标签
        await routerPushByParams(router, RouteNames.Home, queryParams)
    }

    // 更新查询参数
    const updateQueryParams = async () => {
        const { hasPaginationParams, hasQueryParams, queryParamsResult } = await parseRouteQuery(route.query, options as QueryParamsOptions<ViewPostRequest>)

        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as keyof typeof queryParams])
        if (hasQueryParams) {
            Object.assign(queryParams, queryParamsResult)
        }

        hasPaginationParamsInURL.value = hasPaginationParams
    }

    // 生成面包屑路径
    const generateBreadcrumbPath = () => {
        return router.resolve({
            name: RouteNames.Home,
            query: queryParams,
        }).href
    }

    const clearParamsExcept = (fieldsToKeep: ViewPostResKey[]) => {
        const keysToClear: ViewPostResKey[] = [
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

            // "highlight_fields",
            // "pre_tags",
            // "post_tags",
        ]

        keysToClear.forEach((key) => {
            if (!fieldsToKeep.includes(key)) {
                delete queryParams[key as ViewPostResKey]
            }
        })
    }

    // 重置分页配置
    const resetPaginationConf = () => {
        paginationBlockVisibleCount.value = 1
        pageSizeTemp.value = 10
    }

    return {
        hasPaginationParamsInURL,
        updateRouterPush,
        updateQueryParams,
        clearParamsExcept,
        paginationBlockVisibleCount,
        pageSizeTemp,
        resetPaginationConf,
        generateBreadcrumbPath,
    }
}
