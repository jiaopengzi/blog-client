/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-26 18:43:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 13:16:54
 * @FilePath     : \blog-client\src\api\permissionRole\getPermissionRole.ts
 * @Description  : 获取角色权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { request, routerGroup } from "@/api/request"
import { PermissionNames } from "@/utils/permissionRole"
import type { Res, ResPromise } from "@/api/response"

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
export function getPermissionRoleAPI(
    requestData: GetPermissionRoleRequest,
): ResPromise<Res<GetPermissionRoleResData>> {
    const urlStr = routerGroup + "/role/get-permission-role"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
