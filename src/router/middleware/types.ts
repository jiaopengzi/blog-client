/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-03 11:07:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 11:07:59
 * @FilePath     : \blog-client\src\router\middleware\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import type { RouteLocationNormalized } from "vue-router"

// 中间件函数类型约束
export type MiddlewareFunction = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
) => Promise<boolean | string | object>
