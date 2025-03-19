/**
 * @FilePath     : \blog-client\src\dev.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 开发环境下需要运行的函数
 */

import { devCheckIconKeys, iconMap } from "@/components/common/icons"
import { usePermissionRoleStore } from "@/stores/permissionRole"

/**
 * @description: 开发环境运行的函数，主要在控制台输出一些信息便于开发调试
 * @return
 */
export function devRun() {
    devCheckIconKeys(iconMap) // 校验 iconMap
    const permissionRoleStore = usePermissionRoleStore()
    permissionRoleStore.devCheckPermissionNames() // 校验权限枚举
}
