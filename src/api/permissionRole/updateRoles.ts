/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-19 21:07:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-19 21:16:23
 * @FilePath     : \blog-client\src\api\permissionRole\updateRoles.ts
 * @Description  : 更新角色权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import { PermissionNames } from "@/utils/permissionRole"
import type { Res, ResPromise } from "@/api/response"

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
