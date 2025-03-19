/**
 * @FilePath     : \blog-client\src\api\permissionRole\deletePermissionRole.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除角色权限
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/stores/permissionRole"

//  删除角色权限 请求参数
export interface DeletePermissionRoleRequest {
    permission_name: PermissionNames
    role_name: string
}

// 删除列表角色权限
export function deletePermissionRoleAPI(requestData: DeletePermissionRoleRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/role/delete-permission-role"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
