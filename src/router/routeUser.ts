/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 12:02:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:49:36
 * @FilePath     : \blog-client\src\router\routeUser.ts
 * @Description  : 用户相关路由
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 路由配置
export const userRoutes = {
    login: {
        path: "/login",
        name: "login",
        component: () => import("@/views/login"),
        meta: {
            requiresAuth: false,
        },
    },
    socialQQLoginCallback: {
        path: "/social/qq/login/callback",
        name: "socialQQLoginCallback",
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    socialQQBindCallback: {
        path: "/social/qq/bind/callback",
        name: "socialQQBindCallback",
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    socialWeChatLoginCallback: {
        path: "/social/wechat/login/callback",
        name: "socialWeChatLoginCallback",
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    socialWeChatBindCallback: {
        path: "/social/wechat/bind/callback",
        name: "socialWeChatBindCallback",
        component: () => import("@/views/social-login-callback"),
        meta: {
            requiresAuth: false,
        },
    },
    register: {
        path: "/register",
        name: "register",
        component: () => import("@/views/register"),
        meta: {
            requiresAuth: false,
        },
    },
    resetPassword: {
        path: "/reset-password",
        name: "resetPassword",
        component: () => import("@/views/reset-password"),
        meta: {
            requiresAuth: false,
        },
    },
    userInfo: {
        path: "/user-info",
        name: "userInfo",
        component: () => import("@/views/user-info"),
        meta: {
            requiresAuth: true,
        },
    },
}
