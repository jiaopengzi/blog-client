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

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { PermissionNames } from "@/utils/permissionRole"
import { type Res } from "@/api/responseCode"

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
): AxiosPromise<Res<GetPermissionRoleResData>> {
    const urlStr = routerGroup + "/role/get-permission-role"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
