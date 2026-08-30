/*
 * FilePath    : blog-client-nuxt\src\composables\useSiteOptions.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 预取站点配置, 供公开页与默认布局共享同一份 asyncData
 */

import { useAsyncData } from "#imports"

import { useOptionsStore } from "@/stores/options"

/**
 * 共享站点配置预取 handler, 保持 useAsyncData key 与 handler 引用一致.
 * @returns 站点配置预取完成标记.
 */
async function loadSiteOptions(): Promise<true> {
    await useOptionsStore().updateFromServer()
    return true
}

/**
 * 预取站点配置, 供公开页与默认布局共享同一份 asyncData 定义.
 * @returns 站点配置对应的 asyncData 结果.
 */
export function useSiteOptions() {
    return useAsyncData("site-options", loadSiteOptions)
}
