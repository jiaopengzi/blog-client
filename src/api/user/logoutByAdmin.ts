/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-20 11:40:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:12:25
 * @FilePath     : \blog-client\src\api\user\logoutByAdmin.ts
 * @Description  : 管理员登出用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface LogoutByAdminRequest {
    logout_user_id: string
}

// 管理员登出用户
export function logoutByAdminAPI(
    logoutByAdminRequest: LogoutByAdminRequest,
): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/logout-by-admin"
    return request({
        url: urlStr,
        method: "post",
        data: logoutByAdminRequest,
    })
}
