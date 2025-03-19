/**
 * @FilePath     : \blog-client\src\api\permissionRole\getPermissions.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取权限列表
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { type Permission } from "@/stores/permissionRole"

export function getPermissionsAPI(): ResPromise<Res<Permission[]>> {
    return request({
        url: routerGroup + "/permission/get-permissions",
        method: "get",
    })
}
