/**
 * @FilePath     : \blog-client\src\router\routeUser.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户相关路由
 */

import type { RouteRecordRaw } from "vue-router"

import { RouteNames } from "./types"

export const userRoutes: RouteRecordRaw[] = [
    {
        path: "/login",
        name: RouteNames.Login,
        component: () => import("@/views/login"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/social/qq/login/callback",
        name: RouteNames.SocialQQLoginCallback,
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/social/qq/bind/callback",
        name: RouteNames.SocialQQBindCallback,
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/social/wechat/login/callback",
        name: RouteNames.SocialWeChatLoginCallback,
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/social/wechat/bind/callback",
        name: RouteNames.SocialWeChatBindCallback,
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/register",
        name: RouteNames.Register,
        component: () => import("@/views/register"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/register-admin",
        name: RouteNames.RegisterAdmin,
        component: () => import("@/views/register-admin"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/reset-password",
        name: RouteNames.ResetPassword,
        component: () => import("@/views/reset-password"),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: "/user-info",
        name: RouteNames.UserInfo,
        component: () => import("@/views/user-info"),
        meta: {
            requiresAuth: true,
        },
    },
]
