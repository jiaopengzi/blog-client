/**
 * @FilePath     : \blog-client\src\router\routes.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 所有路由配置
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
        path: "/link-list",
        name: RouteNames.LinkList,
        component: () => import("@/views/link-list"),
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
