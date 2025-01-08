/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 11:45:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-08 12:12:49
 * @FilePath     : \blog-client\src\router\routes.ts
 * @Description  : 所有路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { RouteRecordRaw } from "vue-router"

import { adminRoutes } from "./routeAdmin"
import { navigationRoutes } from "./routeNavigation"
import { userRoutes } from "./routeUser"
import { RouteNames } from "./types"

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: RouteNames.Home,
        component: () => import("@/views/home"),
        meta: {
            requiresAuth: false,
        },
    },

    {
        path: "/setup",
        name: RouteNames.Setup,
        component: () => import("@/views/setup"),
        meta: {
            requiresAuth: false,
        },
    },

    {
        path: "/test",
        name: RouteNames.Test,
        component: () => import("@/views/test"),
        meta: {
            requiresAuth: false,
        },
        children: [
            {
                path: "page1",
                name: "page1",
                component: () => import("@/views/admin/component/main/post-tag/index.vue"),
            },
            {
                path: "page2",
                name: "page2",
                component: () => import("@/views/admin/component/main/post-category/index.vue"),
            },
        ],
    },
    {
        path: "/test1",
        name: RouteNames.Test1,
        component: () => import("@/views/test/index1.vue"),
        meta: {
            requiresAuth: false,
        },
    },

    // 用户相关路由
    ...userRoutes,
    // 导航相关路由
    ...navigationRoutes,
    // 管理员相关路由
    ...adminRoutes,

    {
        path: "/:pathMatch(.*)*", // 当匹配不到路由时，跳转到404页面
        name: RouteNames.NotFound,
        component: () => import("@/views/404"),
        meta: {
            requiresAuth: false,
        },
    },
]
