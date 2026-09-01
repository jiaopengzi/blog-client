/*
 * FilePath    : blog-client-nuxt\src\api\request\base.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 后端 baseURL 解析 (SSR/CSR/单测三态, 无上下文安全回退)
 */

/*
 * 补充说明:
 * SSR 走 Nuxt runtimeConfig.apiBase (环境变量 NUXT_API_BASE)
 * 浏览器走同源相对路径 (dev 由 nitro.devProxy 转发 /api)
 * 非 Nuxt 运行时 (vitest 等) 回退 process.env 并由 stub 兜底
 */

import { tryUseNuxtApp } from "#imports"

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

    // 无 Nuxt 上下文时不能再调用 useRuntimeConfig, 否则 Nuxt 会先记录 NUXT_E1001 再抛错.
    // 中间件异步链和单测均由环境变量提供同一回退值.
    return process.env.NUXT_API_BASE || ""
}
