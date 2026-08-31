/*
 * FilePath    : blog-client-nuxt\src\composables\useSiteOptions.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 预取站点配置, 供公开页与默认布局共享同一份 asyncData
 */

/*
 * 补充说明:
 * bug01(260831-01 反馈第1轮): SSR 直连后端失败(部署链路问题, 见计划文件 bug03)时 payload 无
 * site-options 数据, Nuxt 会在水合期(onBeforeMount)自动回源重取; 该请求经同源 /api 多半成功,
 * optionsStore 在水合中途被填充 —— 客户端首帧(SSR HTML 为空 store 渲染的占位站壳)与之不一致,
 * 触发 "Hydration completed but contains mismatches." 且页头 logo/导航/页脚闪换.
 * 这里经 getCachedData 哨兵拦截水合期回源: payload 无数据且正在水合时返回 true(与 handler 成功
 * 返回值同形状), 让 useAsyncData 跳过取数、水合按空 store 完成(与 SSR HTML 一致);
 * 回源填充交给 init-stores.client(onNuxtReady, 水合完成后强制 update(true)), 时序上必然晚于水合,
 * 不再产生 mismatch. 正常部署(SSR 取数成功)与客户端导航行为不受影响.
 */

import { useAsyncData } from "#imports"

import type { NuxtApp } from "#app"

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
 * siteOptionsCachedData 读取 site-options 的缓存数据, 并在"SSR 取数失败 + 水合中"场景返回哨兵.
 * @param key asyncData key(恒为 site-options).
 * @param nuxtApp 当前 Nuxt 应用实例.
 * @returns 缓存数据; 水合期无缓存时返回 true 哨兵(跳过水合期回源); 其余无缓存场景返回 undefined(照常取数).
 */
function siteOptionsCachedData(key: string, nuxtApp: NuxtApp): true | undefined {
    const cached = nuxtApp.payload.data[key] ?? (nuxtApp.static as { data?: Record<string, unknown> } | undefined)?.data?.[key]
    if (cached !== undefined && cached !== null) {
        return cached as true
    }
    // SSR 失败窗口: 水合期不回源(见文件头 bug01 说明), 交给 initStores 水合后强制回源
    if (nuxtApp.isHydrating) {
        return true
    }
    return undefined
}

/**
 * 预取站点配置, 供公开页与默认布局共享同一份 asyncData 定义.
 * @returns 站点配置对应的 asyncData 结果.
 */
export function useSiteOptions() {
    return useAsyncData("site-options", loadSiteOptions, { getCachedData: siteOptionsCachedData })
}
