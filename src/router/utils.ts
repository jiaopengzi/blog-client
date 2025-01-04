/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-29 16:27:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 14:38:54
 * @FilePath     : \blog-client\src\router\utils.ts
 * @Description  : 路由工具函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { Router, LocationQueryRaw } from "vue-router"

/**
 * @description: 分页路由跳转
 * @param router 路由实例
 * @param routeName 路由名称
 * @param queryParams 查询参数
 * @example routerPushByParams('PostAll', { 'file-type': 'pdf', 'search': 'example' })
 */
export async function routerPushByParams(
    router: Router,
    routeName: string,
    queryParams: LocationQueryRaw,
): Promise<void> {
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
        query: query,
    })
}
