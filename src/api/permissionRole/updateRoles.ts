/**
 * @FilePath     : \blog-client\src\api\permissionRole\updateRoles.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新角色权限接口
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/stores/permissionRole"

// 更新列表角色权限 请求参数
export interface UpdateRolesRequest {
    roles: UpdateRoleRequest[]
}

// 单行角色权限 请求参数
export interface UpdateRoleRequest {
    role_name: string
    permission_names: PermissionNames[]
}

// 更新列表角色权限
export function updateRolesAPI(requestData: UpdateRolesRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/role/update-roles"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
