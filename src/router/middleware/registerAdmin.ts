/**
 * @FilePath     : \blog-client\src\router\middleware\registerAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 注册管理员中间件
 */

import { type RouteLocationNormalized } from "vue-router"

import { ResponseCode } from "@/api/response/code"
import { hasAdminAPI } from "@/api/setting/hasAdmin"

import { RouteNames } from "../types"

/**
 * 注册管理员中间件
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const registerAdminMiddleware = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // 当访问注册管理员页面时，检查是否已经注册管理员，如果已经注册管理员，则重定向到404页面
    if (to.name === RouteNames.RegisterAdmin) {
        const res = await hasAdminAPI()
        if (res.data.code === ResponseCode.HasAdmin) {
            // 重定向到404页面
            return { name: RouteNames.NotFound }
        }
    }

    // 当从注册管理员页面离开时，检查是否已经注册管理员，如果没有注册管理员，则重定向到注册管理员页面
    if (from.name === RouteNames.RegisterAdmin) {
        const res = await hasAdminAPI()
        if (res.data.code === ResponseCode.NoAdmin) {
            return { name: RouteNames.RegisterAdmin }
        }
    }

    return true
}
