/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-13 14:40:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:47:57
 * @FilePath     : \blog-client\src\api\permissionRole\hasPermission.ts
 * @Description  : 判断是否具有权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import { type Res } from "@/api/responseCode"
import type { AxiosPromise } from "axios"
import { PermissionNames } from "@/utils/permissionRole"

// 判断是否具有权限 请求参数
export interface HasPermissionRequest {
    permission_name: PermissionNames
}

// 注册
export function hasPermissionAPI(requestData: HasPermissionRequest): AxiosPromise<Res<boolean>> {
    const urlStr = routerGroup + "/permission/has-permission"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
