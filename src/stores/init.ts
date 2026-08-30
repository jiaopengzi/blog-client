/*
 * FilePath    : blog-client-nuxt\src\stores\init.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : store 初始化
 */

import { tabSyncManager } from "@/api/request/tabSyncManager"

import { useDeviceStore } from "./device"
import { useOptionsStore } from "./options"
import { PostDetailEditCacheScope, usePermissionRoleStore } from "./permissionRole"
import { useUserStore } from "./user"

/**
 * initStores 初始化应用运行期依赖的 store
 * 执行顺序需要保证 token 同步先于文章详情编辑权限预热, 避免匿名态缓存污染已登录态
 * @returns Promise 在全部 store 初始化完成后结束
 */
export const initStores = async (): Promise<void> => {
    const deviceStore = useDeviceStore()
    const optionsStore = useOptionsStore()
    const permissionRoleStore = usePermissionRoleStore()
    const userStore = useUserStore()

    const isLoadedPermissionRole = permissionRoleStore.isLoadedPermissionRole
    const isLogin = userStore.isLogin

    deviceStore.updateDevice()

    // app-option 保存后刷新页面旧值(bug 260828-01): nuxt 下 isLoadedOptions 可能为 true 却不新鲜 ——
    // SSR 页面来自 payload(随 swr 页面缓存, 最长滞后一个缓存周期), 且 update(false) 读的是
    // localStorage 缓存(可能更旧)。对齐 SPA: 每次整页加载(initStores 仅在启动时执行一次)都强制
    // 回源拉最新配置, 自定义 CSS/统计脚本/导航等派生内容刷新后即刻生效; 执行时机在水合完成后,
    // store 响应式更新不产生 hydration mismatch
    await optionsStore.update(true)

    if (!userStore.accessToken) {
        const syncedToken = await tabSyncManager.requestTokenFromOtherTabs(200)
        if (syncedToken) {
            await tabSyncManager.setTokenSilently(syncedToken)
        }
    }

    await permissionRoleStore.update(!isLoadedPermissionRole)
    await permissionRoleStore.postDetailEditEnable(userStore.accessToken ? PostDetailEditCacheScope.Authenticated : PostDetailEditCacheScope.Anonymous)

    await userStore.getUserInfoByToken(!isLogin)
}

// 共享初始化 Promise: 客户端插件 (水合后触发) 与路由守卫 (受保护页提前触发) 共用同一份初始化,
// 避免重复执行 (插件与守卫都可能调用 initStores)
let initStoresPromise: Promise<void> | null = null

// 共享初始化是否已完成 (bugfix 260829 bug01): 路由守卫据此选择同步拦截或延迟补检
let initStoresSettled = false

/**
 * 获取共享的 initStores Promise。首次调用时启动初始化, 后续调用复用同一 Promise
 * @returns Promise 在全部 store 初始化完成后结束
 */
export const getInitStoresPromise = (): Promise<void> => {
    if (!initStoresPromise) {
        initStoresPromise = initStores().finally(() => {
            initStoresSettled = true
        })
    }
    return initStoresPromise
}

/**
 * isInitStoresReady 判断共享初始化是否已完成.
 * @returns true 表示 initStores 已结束, 登录态可被守卫直接读取.
 */
export const isInitStoresReady = (): boolean => initStoresSettled
