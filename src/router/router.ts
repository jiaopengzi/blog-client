/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-03 11:01:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-08 10:49:00
 * @FilePath     : \blog-client\src\router\router.ts
 * @Description  : 路由
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { createRouter, createWebHistory } from "vue-router"

import { authMiddleware, editorMiddleware, handleMiddleware, setupMiddleware } from "./middleware"
import { routes } from "./routes"

// 创建路由实例
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // 使用history路由模式
    routes, // 路由配置
})

// 路由守卫
router.beforeEach(async (to, from) => {
    const middlewares = [authMiddleware, editorMiddleware, setupMiddleware]
    return await handleMiddleware(middlewares, to, from)
})

export default router
