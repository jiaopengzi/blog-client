/*
 * FilePath    : blog-client\src\stores\init.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : store 初始化
 */

import { useDeviceStore } from "./device"
import { useOptionsStore } from "./options"
import { usePermissionRoleStore } from "./permissionRole"
import { useUserStore } from "./user"

// 初始化所有 store, 注意顺序
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
    await permissionRoleStore.update(!isLoadedPermissionRole)
    await userStore.getUserInfoByToken(!isLogin)
}
