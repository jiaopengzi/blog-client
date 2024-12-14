/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 10:39:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 11:22:05
 * @FilePath     : \blog-client\src\api\permissionRole\getPermissions.ts
 * @Description  : 权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import type { AxiosPromise } from "axios"
import { routerGroup } from "@/api/routerGroup"
import { type Res } from "@/api/responseCode"
import { type Permission } from "@/utils/permissionRole"

export function getPermissionsAPI(): AxiosPromise<Res<Permission[]>> {
    return request({
        url: routerGroup + "/permission/get-permissions",
        method: "get",
    })
}
