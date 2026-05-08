/**
 * @FilePath     : \blog-client\src\router\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由工具
 */

import type { LocationQueryRaw, Router } from "vue-router"

/**
 * @description: 比较目标路由是否与当前路由完全一致, 避免同路由冗余 push 带来的额外导航成本。
 * @param router 路由实例。
 * @param routeName 路由名称。
 * @param query 目标查询参数。
 * @param hash 目标 hash。
 * @return {boolean} 是否与当前路由一致。
 */
function isSameRouteTarget(router: Router, routeName: string, query: LocationQueryRaw, hash: string): boolean {
    const targetRoute = router.resolve({
        name: routeName,
        query,
        hash,
    })

    return targetRoute.fullPath === router.currentRoute.value.fullPath
}

/**
 * @description: 分页路由跳转
 * @param router 路由实例
 * @param routeName 路由名称
 * @param queryParams 查询参数
 * @param hash 路由 hash,默认值为空字符串
 */
export async function routerPushByParams(router: Router, routeName: string, queryParams: LocationQueryRaw, hash: string = ""): Promise<void> {
    const query: LocationQueryRaw = {}

    // 过滤掉值为空字符串的参数
    Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key]
        if (value !== "" && value !== undefined) {
            query[key] = value
        }
    })

    // 如果query中有 password 参数, 则删除
    if ("password" in query) {
        delete query.password
    }

    if (isSameRouteTarget(router, routeName, query, hash)) {
        return
    }

    await router.push({
        name: routeName,
        query,
        hash,
    })
}
