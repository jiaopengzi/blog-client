/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-25 11:51:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 12:54:11
 * @FilePath     : \blog-client\src\components\hooks\useHome\utils.ts
 * @Description  : 工具
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive, ref, type Reactive, type Ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type Pagination } from "@/components/common"
import { type ViewPostRequest } from "@/api/post/view"
import type { PostResPagination } from "@/api/post/common"
import type { BreadcrumbItem, ViewPostResKey } from "./types"
import { parseQueryParams, type QueryParamsOptions } from "@/api/request"

export function useUtils(
    pagination: Reactive<Pagination<PostResPagination>>, // 分页数据
    isRequest: Ref<boolean>, // 是否请求
    queryParams: Reactive<ViewPostRequest>, // 查询参数
    options?: QueryParamsOptions<ViewPostRequest>, // 请求参数选项
) {
    const route = useRoute()
    const router = useRouter()

    const breadcrumbItems = reactive<BreadcrumbItem[]>([]) // 面包屑
    const hasPaginationParamsInURL = ref(false) // URL 中是否有分页参数

    const paginationBlockVisibleCount = ref(1) // 分页块出现次数
    const pageSizeTemp = ref(10) // 临时每页显示条数

    // 更新查询参数
    const updateQueryParamsAndRouter = (isUpdateRouter: boolean = true) => {
        if (!queryParams.key_word) {
            delete queryParams.key_word
        }

        // 判断是否更新路由
        if (isUpdateRouter) {
            router.push({
                name: "home",
                query: queryParams,
            })
        }
    }

    // 从URL中解析参数
    const parseParamsFromURL = async () => {
        const { hasPaginationParams, hasQueryParams, queryParamsResult } = await parseQueryParams(
            route.query,
            options as QueryParamsOptions<ViewPostRequest>,
        )

        // 清空 queryParams
        Object.keys(queryParams).forEach(
            (key) => delete queryParams[key as keyof typeof queryParams],
        )
        if (hasQueryParams) {
            Object.assign(queryParams, queryParamsResult)
        }

        hasPaginationParamsInURL.value = hasPaginationParams
    }

    // 更新是否请求标志
    const updateIsRequest = ({ newPageSize = 10, newCurrentPage = 1 }) => {
        // 超过请记录数则不请求
        const isMaxPageSizeOld = pagination.total < pagination.page_size * pagination.current_page
        const isMaxPageSizeNew = pagination.total < newPageSize * newCurrentPage
        isRequest.value = !(isMaxPageSizeOld && isMaxPageSizeNew)
    }

    // 生成面包屑路径
    const generateBreadcrumbPath = () => {
        return router.resolve({
            name: "home",
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
        breadcrumbItems,
        hasPaginationParamsInURL,
        updateQueryParamsAndRouter,
        parseParamsFromURL,
        updateIsRequest,
        generateBreadcrumbPath,
        updateBreadcrumbItems,
        updatePageBreadcrumb,
        clearParamsExcept,
        paginationBlockVisibleCount,
        pageSizeTemp,
        reSetPaginationConf,
    }
}
