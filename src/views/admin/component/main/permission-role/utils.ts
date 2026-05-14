/**
 * @FilePath     : \blog-client\src\views\admin\component\main\permission-role\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import type { UpdateRoleRequest, UpdateRolesRequest } from "@/api/permissionRole/updateRoles"
import { PermissionNames } from "@/stores/permissionRole"

import type { PermissionRow, Role } from "./types"
import { LimitPeriod, type PermissionRole } from "./types"

/**
 * @description: 将当前权限表格勾选状态转换为 update-roles 请求体.
 * @param rolesList 当前页面中的角色列表.
 * @param permissionsData 当前页面中的权限矩阵数据.
 * @returns 返回可直接发送给后端的请求对象.
 */
export function buildUpdateRolesRequest(rolesList: Role[], permissionsData: PermissionRow[]): UpdateRolesRequest {
    return {
        roles: rolesList.map(
            (role): UpdateRoleRequest => ({
                role_name: role.role_name,
                permission_names: permissionsData.filter((row) => row[role.role_name]).map((row) => row.permissionName as PermissionNames),
            }),
        ),
    }
}

/**
 * @description: 规范化 update-roles 请求体, 统一排序后用于比较是否发生变更.
 * @param request 待规范化的请求对象.
 * @returns 返回字段顺序稳定的请求对象副本.
 */
export function normalizeUpdateRolesRequest(request: UpdateRolesRequest): UpdateRolesRequest {
    return {
        roles: request.roles
            .map((role) => ({
                role_name: role.role_name,
                // oxlint-disable-next-line unicorn/no-array-sort
                permission_names: [...role.permission_names].sort((left, right) => left.localeCompare(right)),
            }))
            // oxlint-disable-next-line unicorn/no-array-sort
            .sort((left, right) => left.role_name.localeCompare(right.role_name)),
    }
}

/**
 * @description: 判断当前页面权限勾选结果是否相对服务端快照发生变更.
 * @param nextRequest 当前页面生成的最新 update-roles 请求体.
 * @param currentRoles 服务端最新快照中的角色列表.
 * @returns true 表示存在变更, false 表示没有变更.
 */
export function hasUpdateRolesChanges(nextRequest: UpdateRolesRequest, currentRoles: Role[]): boolean {
    const currentRequest = normalizeUpdateRolesRequest({
        roles: currentRoles.map((role) => ({
            role_name: role.role_name,
            permission_names: [...role.permission_names],
        })),
    })
    const normalizedNextRequest = normalizeUpdateRolesRequest(nextRequest)

    return JSON.stringify(normalizedNextRequest) !== JSON.stringify(currentRequest)
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
                // oxlint-disable-next-line unicorn/no-array-sort
                .sort(([, a], [, b]) => (a as number) - (b as number))

            cache = limitPeriodEntries.map(([key]) => key)
        }
        return cache
    }
})()

/**
 * @description: 获取对象安全属性
 */
export const getSafeProperty = (obj: Record<string, PermissionRole> | null, key: string, defaultValue: PermissionRole | null = null): PermissionRole | null => {
    if (!obj) return defaultValue
    return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue
}
