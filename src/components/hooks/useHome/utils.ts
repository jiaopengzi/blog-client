/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-25 11:51:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-07 23:22:16
 * @FilePath     : \blog-client\src\components\hooks\useHome\utils.ts
 * @Description  : 工具
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type Reactive, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { type ViewPostRequest } from "@/api/post/view"
import { type QueryParamsOptions } from "@/api/request"
import { routerPushByParams } from "@/router"
import { routeObj } from "@/router/routeAll"
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
        await routerPushByParams(router, routeObj.home.name as string, queryParams)
    }

    // 更新查询参数
    const updateQueryParams = async () => {
        const { hasPaginationParams, hasQueryParams, queryParamsResult } = await parseRouteQuery(
            route.query,
            options as QueryParamsOptions<ViewPostRequest>,
        )

        console.log("route.query===========>", route.query)

        // 清空 queryParams
        Object.keys(queryParams).forEach(
            (key) => delete queryParams[key as keyof typeof queryParams],
        )
        if (hasQueryParams) {
            Object.assign(queryParams, queryParamsResult)
        }

        hasPaginationParamsInURL.value = hasPaginationParams
    }

    // 生成面包屑路径
    const generateBreadcrumbPath = () => {
        return router.resolve({
            name: routeObj.home.name,
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
            "post_tag_id",
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
    const reSetPaginationConf = () => {
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
        reSetPaginationConf,
    }
}
