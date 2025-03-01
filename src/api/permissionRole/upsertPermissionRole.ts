/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-26 16:54:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:49:10
 * @FilePath     : \blog-client\src\api\permissionRole\upsertPermissionRole.ts
 * @Description  : 插入或更新角色权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/utils/permissionRole"

//  插入或更新角色权限 请求参数
export interface UpsertPermissionRoleRequest {
    permission_name: PermissionNames // 权限名称
    role_name: string // 角色名称
    limit_count: number // 限制次数
    limit_period: number // 限制周期(秒数)
}

// 更新列表角色权限
export function upsertPermissionRoleAPI(requestData: UpsertPermissionRoleRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/role/upsert-permission-role"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
