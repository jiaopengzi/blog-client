/**
 * FilePath    : blog-client\src\views\admin\component\main\permission-role\utils.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description  : 权限角色工具函数测试
 */

import { describe, expect, it } from "vitest"

import { PermissionNames } from "@/stores/permissionRole"

import type { PermissionRow, Role } from "./types"
import { buildUpdateRolesRequest, hasUpdateRolesChanges, normalizeUpdateRolesRequest } from "./utils"

/**
 * @description: 创建测试用的权限行数据, 避免对象字面量直接命中动态索引签名限制.
 * @param permissionIndex 当前权限行序号.
 * @param permissionName 权限名称.
 * @param permissionDescription 权限描述.
 * @param roleFlags 角色与是否拥有权限的映射.
 * @returns 返回与页面表格结构一致的权限行对象.
 */
function createPermissionRow(
    permissionIndex: number,
    permissionName: PermissionNames,
    permissionDescription: string,
    roleFlags: Record<string, boolean>,
): PermissionRow {
    const row = {} as PermissionRow
    row.permissionIndex = permissionIndex
    row.permissionName = permissionName
    row.permissionDescription = permissionDescription

    Object.entries(roleFlags).forEach(([roleName, enabled]) => {
        row[roleName] = enabled
    })

    return row
}

describe("buildUpdateRolesRequest", () => {
    it("根据权限矩阵生成 update-roles 请求体", () => {
        const rolesList: Role[] = [
            { role_name: "Author", permission_names: [], description: "作者" },
            { role_name: "Subscriber", permission_names: [], description: "订阅者" },
        ]
        const permissionsData: PermissionRow[] = [
            createPermissionRow(1, PermissionNames.AddAvatar, "上传头像", { Author: true, Subscriber: true }),
            createPermissionRow(2, PermissionNames.AddPost, "新增文章", { Author: true, Subscriber: false }),
        ]

        expect(buildUpdateRolesRequest(rolesList, permissionsData)).toEqual({
            roles: [
                { role_name: "Author", permission_names: [PermissionNames.AddAvatar, PermissionNames.AddPost] },
                { role_name: "Subscriber", permission_names: [PermissionNames.AddAvatar] },
            ],
        })
    })
})

describe("hasUpdateRolesChanges", () => {
    it("权限未变化时返回 false, 忽略顺序差异", () => {
        const nextRequest = {
            roles: [
                { role_name: "Subscriber", permission_names: [PermissionNames.AddAvatar] },
                { role_name: "Author", permission_names: [PermissionNames.AddPost, PermissionNames.AddAvatar] },
            ],
        }
        const currentRoles: Role[] = [
            { role_name: "Author", permission_names: [PermissionNames.AddAvatar, PermissionNames.AddPost], description: "作者" },
            { role_name: "Subscriber", permission_names: [PermissionNames.AddAvatar], description: "订阅者" },
        ]

        expect(hasUpdateRolesChanges(nextRequest, currentRoles)).toBe(false)
    })

    it("权限发生变化时返回 true", () => {
        const nextRequest = normalizeUpdateRolesRequest({
            roles: [{ role_name: "Author", permission_names: [PermissionNames.AddAvatar] }],
        })
        const currentRoles: Role[] = [{ role_name: "Author", permission_names: [PermissionNames.AddAvatar, PermissionNames.AddPost], description: "作者" }]

        expect(hasUpdateRolesChanges(nextRequest, currentRoles)).toBe(true)
    })
})
