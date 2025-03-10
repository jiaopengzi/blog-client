/**
 * @FilePath     : \blog-client\src\router\router.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由
 */

import { createRouter, createWebHistory } from "vue-router"

import { authMiddleware, beforeunloadMiddleware, editorMiddleware, handleMiddleware, registerAdminMiddleware, setupMiddleware } from "./middleware"
import { routes } from "./routes"

// 创建路由实例
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // 使用history路由模式
    routes, // 路由配置
})

// 路由守卫
router.beforeEach(async (to, from) => {
    const middlewares = [authMiddleware, beforeunloadMiddleware, editorMiddleware, registerAdminMiddleware, setupMiddleware]
    return await handleMiddleware(middlewares, to, from)
})

export default router
