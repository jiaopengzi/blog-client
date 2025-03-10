/**
 * @FilePath     : \blog-client\src\api\permissionRole\hasPermission.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 判断是否具有权限
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { PermissionNames } from "@/utils/permissionRole"

// 判断是否具有权限 请求参数
export interface HasPermissionRequest {
    permission_name: PermissionNames
}

// 注册
export function hasPermissionAPI(requestData: HasPermissionRequest): ResPromise<Res<boolean>> {
    const urlStr = routerGroup + "/permission/has-permission"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
