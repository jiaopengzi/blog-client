/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 15:26:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-08 11:40:35
 * @FilePath     : \blog-client\src\router\routeNavigation.ts
 * @Description  : 导航相关路由
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { RouteRecordRaw } from "vue-router"

import { RouteNames } from "./types"

export const navigationRoutes: RouteRecordRaw[] = [
    {
        path: "/post",
        name: RouteNames.Post,
        component: () => import("@/views/test"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/video",
        name: RouteNames.Video,
        component: () => import("@/views/test"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/doc",
        name: RouteNames.Doc,
        component: () => import("@/views/test"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/tool",
        name: RouteNames.Tool,
        component: () => import("@/views/test"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/vip",
        name: RouteNames.Vip,
        component: () => import("@/views/test"),
        meta: {
            requiresAuth: false,
        },
    },
]
