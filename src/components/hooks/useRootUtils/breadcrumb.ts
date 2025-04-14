/*
 * FilePath    : blog-client\src\components\hooks\useRootUtils\breadcrumb.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 面包屑相关
 */

import { type Reactive } from "vue"
import { useRouter } from "vue-router"

import { RouteNames } from "@/router"

import type { QueryParams } from "./types"

export function useBreadcrumb<T extends QueryParams>(
    queryParams: Reactive<T>, // 查询参数
) {
    const router = useRouter()

    // 生成面包屑路径
    const generateBreadcrumbPath = () => {
        // 如果有分页参数,需要移除当前页码，保证生成面包屑路径正确
        const breadcrumbQuery = queryParams
        if (queryParams.current_page) {
            delete breadcrumbQuery.current_page
        }

        return router.resolve({
            name: RouteNames.Home,
            query: breadcrumbQuery,
        }).href
    }

    return {
        generateBreadcrumbPath,
    }
}
