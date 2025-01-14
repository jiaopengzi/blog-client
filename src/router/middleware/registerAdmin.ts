/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-14 11:43:34
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-14 11:48:50
 * @FilePath     : \blog-client\src\router\middleware\registerAdmin.ts
 * @Description  : 注册管理员中间件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type RouteLocationNormalized } from "vue-router"

import { ResponseCode } from "@/api/response/code"
import { hasAdminAPI } from "@/api/setting/hasAdmin"

import { RouteNames } from "../types"

/**
 * 当数据库已经安装时，访问设置页面时，重定向到404页面
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const registerAdminMiddleware = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
) => {
    if (to.name === RouteNames.RegisterAdmin) {
        const res = await hasAdminAPI()
        if (res.data.code === ResponseCode.HasAdmin) {
            // 重定向到404页面
            return { name: RouteNames.NotFound }
        }
    }

    return true
}
