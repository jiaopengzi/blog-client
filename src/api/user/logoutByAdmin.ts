/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-20 11:40:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-20 11:42:05
 * @FilePath     : \blog-client\src\api\user\logoutByAdmin.ts
 * @Description  : 管理员登出用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface LogoutByAdminRequest {
    logout_user_id: string
}

// 管理员登出用户
export function logoutByAdminAPI(logoutByAdminRequest: LogoutByAdminRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/user/logout-by-admin"
    return request({
        url: urlStr,
        method: "post",
        data: logoutByAdminRequest,
    })
}
