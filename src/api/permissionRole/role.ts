/**
 * @FilePath     : \blog-client\src\api\permissionRole\role.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 角色相关
 */

import { type UpsertPermissionRoleRequest } from "@/api/permissionRole/upsertPermissionRole"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/stores/permissionRole"

// 不作为 role_name 唯一约束
export enum RoleName {
    Administrator = "Administrator", // 管理员
    Editor = "Editor", // 编辑
    Author = "Author", // 作者
    Contributor = "Contributor", // 投稿者
    Subscriber = "Subscriber", // 订阅者
}

export interface Role {
    role_name: string
    permission_names: PermissionNames[]
    description: string
}

export interface RoleWithLimit {
    roles: Role[]
    permission_role: Record<string, UpsertPermissionRoleRequest>
}

export function getRolesAPI(): ResPromise<Res<RoleWithLimit>> {
    return request({
        url: routerGroup + "/role/get-roles",
        method: "get",
    })
}
