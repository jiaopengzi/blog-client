/**
 * @FilePath     : \blog-client\src\router\middleware\setup.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 安装数据库中间件
 */

import { type RouteLocationNormalized } from "vue-router"

import { ResponseCode } from "@/api/response/code"
import { isSetupAPI } from "@/api/setting/isSetup"

import { RouteNames } from "../types"

/**
 * 当数据库已经安装时，访问设置页面时，重定向到404页面
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const setupMiddleware = async (to: RouteLocationNormalized) => {
    if (to.name === RouteNames.Setup) {
        const res = await isSetupAPI()
        if (res.data.code === ResponseCode.SetupAlready) {
            // 重定向到404页面
            return { name: RouteNames.NotFound }
        }
    }

    return true
}
