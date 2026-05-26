/**
 * @FilePath     : \blog-client\src\router\middleware\beforeunload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 页面卸载缓存清理
 */

import { LocalStorageKey } from "@/stores/local"

let isBeforeUnloadCleanupRegistered = false

/**
 * handleBeforeUnload 在页面卸载前清理可由初始化流程重新拉取的本地缓存.
 * 该处理器只做缓存清理, 不阻止关闭, 刷新或跳转.
 * @returns 无返回值.
 */
function handleBeforeUnload(): void {
    // 清除需要处理的本地存储
    localStorage.removeItem(LocalStorageKey.OptionsApp)
    localStorage.removeItem(LocalStorageKey.OptionsHeadInfo)
    localStorage.removeItem(LocalStorageKey.OptionsNavList)
    localStorage.removeItem(LocalStorageKey.OptionsNavObj)
    localStorage.removeItem(LocalStorageKey.OptionsFooterInfo)
    localStorage.removeItem(LocalStorageKey.PostDetailEditEnable)
}

/**
 * beforeunloadMiddleware 注册页面卸载缓存清理监听.
 * 路由守卫会多次执行该中间件, 因此使用模块级标记确保只注册一次监听器.
 * @returns 始终允许继续导航.
 */
export const beforeunloadMiddleware = async () => {
    if (isBeforeUnloadCleanupRegistered) {
        return true
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    isBeforeUnloadCleanupRegistered = true

    return true
}
