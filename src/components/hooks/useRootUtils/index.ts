/*
 * FilePath    : blog-client\src\components\hooks\useRootUtils\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 根路径的工具 hook
 */

export * from "./types"

import { type Reactive } from "vue"

import { type QueryParamsOptions } from "@/api/request"

import { useBreadcrumb } from "./breadcrumb"
import { useRootRoute } from "./route"
import type { QueryParams } from "./types"

export function useRootUtils<T extends QueryParams>(
    queryParams: Reactive<T>, // 查询参数
    options?: Reactive<QueryParamsOptions<T>>, // 请求参数选项
) {
    const {
        generateBreadcrumbPath, // 生成面包屑路径
    } = useBreadcrumb(queryParams)

    const {
        hasPaginationInURL, // URL 中是否有分页参数
        updateRouterPush, // 更新查询参数和路由
        updateQueryParams, // 从 URL 中解析参数
        clearParamsExcept, // 清空除了指定参数的查询条件
    } = useRootRoute(queryParams, options)

    return {
        generateBreadcrumbPath,
        hasPaginationInURL,
        updateRouterPush,
        updateQueryParams,
        clearParamsExcept,
    }
}
