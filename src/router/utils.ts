/**
 * @FilePath     : \blog-client\src\router\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由工具
 */

import type { LocationQueryRaw, Router } from "vue-router"

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

    await router.push({
        name: routeName,
        query,
        hash,
    })
}
