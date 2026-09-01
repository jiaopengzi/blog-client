/*
 * FilePath    : blog-client-nuxt\src\api\request\base.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 后端 baseURL 解析 (SSR/CSR/单测三态)
 */

/*
 * 补充说明:
 * SSR 走 Nuxt runtimeConfig.apiBase (环境变量 NUXT_API_BASE)
 * 浏览器走同源相对路径 (dev 由 nitro.devProxy 转发 /api)
 * 非 Nuxt 运行时 (vitest 等) 回退 process.env 并由 stub 兜底
 */

import { tryUseNuxtApp, useRuntimeConfig } from "#imports"

/**
 * @description: 解析后端 baseURL
 * @returns SSR 返回后端直连地址; 浏览器返回空字符串 (同源相对路径)
 */
export function resolveApiBase(): string {
    // 浏览器: 相对路径, 同源 /api
    if (typeof window !== "undefined") {
        return ""
    }

    // SSR: 优先当前 Nuxt app 上下文中的 runtimeConfig; 无上下文时回退环境变量
    const apiBase = tryUseNuxtApp()?.$config?.apiBase
    if (typeof apiBase === "string" && apiBase) {
        return apiBase
    }

    // 路由中间件的异步请求链中可能无法保留 Nuxt app 上下文, 此时从 runtimeConfig 重新取值.
    try {
        const runtimeApiBase = useRuntimeConfig().apiBase
        if (typeof runtimeApiBase === "string" && runtimeApiBase) {
            return runtimeApiBase
        }
    } catch {
        // 非 Nuxt 运行时 (vitest 等) 没有 runtimeConfig, 继续使用环境变量回退.
    }

    return process.env.NUXT_API_BASE || ""
}
