/**
 * @FilePath     : \blog-client\src\api\user\logoutByAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 管理员登出用户
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface LogoutByAdminRequest {
    logout_user_id: string
}

// 管理员登出用户
export function logoutByAdminAPI(logoutByAdminRequest: LogoutByAdminRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/logout-by-admin"
    return request({
        url: urlStr,
        method: "post",
        data: logoutByAdminRequest,
    })
}
