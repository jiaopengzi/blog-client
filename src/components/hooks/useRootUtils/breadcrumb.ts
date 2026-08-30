/*
 * FilePath    : blog-client-nuxt\src\components\hooks\useRootUtils\breadcrumb.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 面包屑相关
 */

import { type Reactive } from "vue"

import { RouteNames } from "@/router"

import type { QueryParams } from "./types"

export function useBreadcrumb<T extends QueryParams>(
    queryParams: Reactive<T>, // 查询参数
) {
    const router = useRouter()

    // 生成面包屑路径 (阶段 3 新方案: 归档年/月走独立路由, 其余保持首页 query 形态)
    const generateBreadcrumbPath = (kind?: "year" | "month") => {
        // 归档年 crumb → /year/:year (计划 3.3, 不复用旧 ?year= 查询机制)
        if (kind === "year") {
            return router.resolve({
                name: "year-only",
                params: { year: String(queryParams.year) },
            }).href
        }

        // 归档月 crumb → /year/:year/month/:month
        if (kind === "month") {
            return router.resolve({
                name: "year-month",
                params: { year: String(queryParams.year), month: String(queryParams.month) },
            }).href
        }

        // 搜索/分类/标签: 保持首页 query 形态; 如有分页参数, 需要移除当前页码, 保证生成面包屑路径正确
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
