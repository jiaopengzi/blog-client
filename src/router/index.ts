/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 17:59:53
 * @FilePath     : \blog-client\src\router\index.ts
 * @Description  : 路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { createRouter, createWebHistory } from "vue-router"
import { routes } from "@/router/routeAll"
import { handleMiddleware } from "@/router/middleware"
import { authMiddleware } from "@/router/middleware/auth"
import { editorMiddleware } from "@/router/middleware/editor"

// 创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // 使用history路由模式
    routes, // 路由配置
})

// 路由守卫
router.beforeEach(async (to, from) => {
    const middlewares = [authMiddleware, editorMiddleware]
    return await handleMiddleware(middlewares, to, from)
})

export default router
