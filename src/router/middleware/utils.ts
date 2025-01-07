/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-03 11:08:03
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-07 21:58:12
 * @FilePath     : \blog-client\src\router\middleware\utils.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import type { RouteLocationNormalized } from "vue-router"

import type { MiddlewareFunction } from "./types"

/**
 * 处理一组中间件函数
 *
 * @param middlewares - 中间件函数数组
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 * @returns 如果所有中间件都返回 true，则返回 true；否则返回第一个非 true 的结果
 */
export const handleMiddleware = async (
    middlewares: MiddlewareFunction[],
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
) => {
    // 遍历所有中间件函数
    for (const middleware of middlewares) {
        // 执行中间件函数并等待其结果
        const result = await middleware(to, from)

        // 如果中间件函数的返回值不是 true，则停止执行后续中间件并返回该结果
        if (result !== true) {
            return result
        }
    }

    // 如果所有中间件都返回 true，则返回 true
    return true
}
