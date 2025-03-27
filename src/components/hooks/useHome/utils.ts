/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import { type Reactive, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { type ViewPostRequest } from "@/api/post/view"
import { type QueryParamsOptions } from "@/api/request"
import { routerPushByParams } from "@/router"
import { RouteNames } from "@/router"
import { parseRouteQuery } from "@/utils/queryParam"

import type { BreadcrumbItem, ViewPostResKey } from "./types"

export function useUtils(
    queryParams: Reactive<ViewPostRequest>, // 查询参数
    options?: QueryParamsOptions<ViewPostRequest>, // 请求参数选项
) {
    const route = useRoute()
    const router = useRouter()

    const isBreadcrumbClick = ref(false) // 是否点击面包屑

    const breadcrumbItems = reactive<BreadcrumbItem[]>([]) // 面包屑
    const hasPaginationParamsInURL = ref(false) // URL 中是否有分页参数

    const paginationBlockVisibleCount = ref(1) // 分页块出现次数
    const pageSizeTemp = ref(10) // 临时每页显示条数

    // 更新查询参数
    const updateRouterPush = async () => {
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

    // 生成面包屑路径
    const updateBreadcrumbItems = (text: string, isClear: boolean = true) => {
        // 清空面包屑
        if (isClear) {
            breadcrumbItems.length = 0
        }

        // 更新面包屑
        const breadcrumbItem: BreadcrumbItem = {
            display: text,
            to: generateBreadcrumbPath(),
        }

        breadcrumbItems.push(breadcrumbItem)
    }

    // 更新页码面包屑
    const updatePageBreadcrumb = () => {
        // 当 current_page 为 1 时不显示
        if (queryParams.current_page && queryParams.current_page !== 1) {
            updateBreadcrumbItems(`第 ${queryParams.current_page} 页`, false)
        }
    }

    // 点击面包屑
    const clickBreadcrumb = (item: BreadcrumbItem) => {
        isBreadcrumbClick.value = true
    }

    // 清空查询参数中的特定字段
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
        isBreadcrumbClick,
        breadcrumbItems,
        clickBreadcrumb,
        hasPaginationParamsInURL,
        updateRouterPush,
        updateQueryParams,
        generateBreadcrumbPath,
        updateBreadcrumbItems,
        updatePageBreadcrumb,
        clearParamsExcept,
        paginationBlockVisibleCount,
        pageSizeTemp,
        resetPaginationConf,
    }
}
