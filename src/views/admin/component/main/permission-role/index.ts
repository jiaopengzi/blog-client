/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-15 15:09:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-28 14:23:54
 * @FilePath     : \blog-client\src\views\admin\component\main\permission-role\index.ts
 * @Description  : 权限角色管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export { default } from "./index.vue"
import { PermissionNames } from "@/utils/permissionRole"
import { type UpsertPermissionRoleRequest } from "@/api/permissionRole/upsertPermissionRole"

// 定义角色接口
export interface Role {
    role_name: string // 角色名称
    permission_names: PermissionNames[] // 权限名称数组
    description: string // 角色描述
    allSelected?: boolean // 是否全选，可选属性
}

// 定义权限行接口，权限名+角色名对应的权限状态
export type PermissionRow = { permissionName: PermissionNames; permissionDescription: string } & {
    [roleName: string]: boolean
}

export enum LimitCount {
    "不限制" = 0,
    "10次" = 10,
    "50次" = 50,
    "100次" = 100,
    "500次" = 500,
    "1000次" = 1000,
}

export enum LimitPeriod {
    "不限制" = 0, // 不限制
    "10Min" = 600, // 10分钟
    "1H" = 3600, // 1小时
    "1D" = 86400, // 1天
    "1W" = 604800, // 1周
    "1M" = 2592000, // 1月
    "1Y" = 31536000, // 1年
}

/**
 * @description: 返回升序排序的限制时间键数组
 */
export const getSortedLimitPeriodKeys = (() => {
    let cache: string[] | null = null

    return () => {
        if (!cache) {
            const limitPeriodEntries = Object.entries(LimitPeriod)
                .filter(([, value]) => typeof value === "number")
                .sort(([, a], [, b]) => (a as number) - (b as number))

            cache = limitPeriodEntries.map(([key]) => key)
        }
        return cache
    }
})()

// 定义权限角色接口
export interface PermissionRole extends UpsertPermissionRoleRequest {}
