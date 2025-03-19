/**
 * @FilePath     : \blog-client\src\api\permissionRole\getPermissionRole.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取角色权限
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/stores/permissionRole"

//  删除角色权限 请求参数
export interface GetPermissionRoleRequest {
    permission_name: PermissionNames
    role_name: string
}

export interface GetPermissionRoleResData {
    permission_name: PermissionNames
    role_name: string
    limit_count: number
    limit_period: number
}

// 获取角色权限
export function getPermissionRoleAPI(requestData: GetPermissionRoleRequest): ResPromise<Res<GetPermissionRoleResData>> {
    const urlStr = routerGroup + "/role/get-permission-role"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
