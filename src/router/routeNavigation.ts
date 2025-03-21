/**
 * @FilePath     : \blog-client\src\router\routeNavigation.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 导航相关路由
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
    // {
    //     path: "/doc",
    //     name: RouteNames.Doc,
    //     component: () => import("@/views/test"),
    //     meta: {
    //         requiresAuth: false,
    //     },
    // },
    // {
    //     path: "/tool",
    //     name: RouteNames.Tool,
    //     component: () => import("@/views/test"),
    //     meta: {
    //         requiresAuth: false,
    //     },
    // },
    // {
    //     path: "/vip",
    //     name: RouteNames.Vip,
    //     component: () => import("@/views/test"),
    //     meta: {
    //         requiresAuth: false,
    //     },
    // },
]
