/*
 * FilePath    : blog-client\src\router\middleware\home.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 首页状态更新
 */

import { type RouteLocationNormalized } from "vue-router"

import { useStatusStore } from "@/stores/status"
import { parseRouteQueryStatus } from "@/utils/queryParam"

import { RouteNames } from "../types"

/**
 * 当数据库已经安装时，访问设置页面时，重定向到404页面
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const homeMiddleware = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.name === RouteNames.Home) {
        console.log("============>路由中间件", to.name, to.query)
        const statusStore = useStatusStore()
        const { hasKeyWord, hasPostDetail } = await parseRouteQueryStatus(to.query)

        if (hasKeyWord) {
            statusStore.setSearch()
        } else if (hasPostDetail) {
            statusStore.setPostDetail()
        } else {
            statusStore.setHome()
        }
    }

    return true
}
