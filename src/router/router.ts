/**
 * @FilePath     : \blog-client\src\router\router.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由
 */

import { createRouter, createWebHistory } from "vue-router"

import { useOptionsStore } from "@/stores/options"
import { blockFooterStatisticsForPath } from "@/utils/footerStatistics"

import {
    authMiddleware,
    beforeunloadMiddleware,
    checkoutMiddleware,
    handleMiddleware,
    homeMiddleware,
    pageMiddleware,
    postSlugMiddleware,
    registerAdminMiddleware,
    setupMiddleware,
    updateHeadMiddleware,
} from "./middleware"
import { routes } from "./routes"

// 创建路由实例
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // 使用history路由模式
    routes, // 路由配置
})

// 路由守卫
router.beforeEach(async (to, from) => {
    const optionsStore = useOptionsStore()

    // 进入 admin 前先禁用统计, 避免第三方统计 SDK 在 SPA 路由切换时自动上报.
    blockFooterStatisticsForPath(optionsStore.footer_statistics_code, to.path)

    const middlewares = [
        authMiddleware,
        beforeunloadMiddleware,
        checkoutMiddleware,
        homeMiddleware,
        pageMiddleware,
        postSlugMiddleware,
        registerAdminMiddleware,
        setupMiddleware,
        updateHeadMiddleware,
    ]
    return await handleMiddleware(middlewares, to, from)
})

export default router
