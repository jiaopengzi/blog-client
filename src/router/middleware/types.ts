/**
 * @FilePath     : \blog-client\src\router\middleware\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import type { RouteLocationNormalized } from "vue-router"

// 中间件函数类型约束
export type MiddlewareFunction = (to: RouteLocationNormalized, from: RouteLocationNormalized) => Promise<boolean | string | object>
