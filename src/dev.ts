/*
 * FilePath    : blog-client-nuxt\src\dev.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 开发环境下需要运行的函数 (迁移自 spa src/dev.ts)
 */

import { devCheckIconKeys, iconMap } from "@/components/common/icons"
import { usePermissionRoleStore } from "@/stores/permissionRole"

/**
 * @description: 开发环境运行的函数, 主要在控制台输出一些信息便于开发调试
 */
export async function devRun() {
    devCheckIconKeys(iconMap) // 校验 iconMap
    const permissionRoleStore = usePermissionRoleStore()
    await permissionRoleStore.devCheckPermissionNames() // 校验权限枚举
}
