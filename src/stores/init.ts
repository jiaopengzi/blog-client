/*
 * FilePath    : blog-client\src\stores\init.ts
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
 * initStores 初始化应用运行期依赖的 store。
 * 执行顺序需要保证 token 同步先于文章详情编辑权限预热, 避免匿名态缓存污染已登录态。
 * @returns Promise 在全部 store 初始化完成后结束。
 */
export const initStores = async (): Promise<void> => {
    const deviceStore = useDeviceStore()
    const optionsStore = useOptionsStore()
    const permissionRoleStore = usePermissionRoleStore()
    const userStore = useUserStore()

    const isLoadedOptions = optionsStore.isLoadedOptions
    const isLoadedPermissionRole = permissionRoleStore.isLoadedPermissionRole
    const isLogin = userStore.isLogin

    deviceStore.updateDevice()
    await optionsStore.update(!isLoadedOptions)

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
