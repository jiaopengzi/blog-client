/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 21:01:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:48:44
 * @FilePath     : \blog-client\src\api\permissionRole\role.ts
 * @Description  : 角色相关
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type UpsertPermissionRoleRequest } from "@/api/permissionRole/upsertPermissionRole"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/utils/permissionRole"

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
