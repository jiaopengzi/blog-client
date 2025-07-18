/**
 * @FilePath     : \blog-client\src\api\user\registerAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 注册管理员
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface RegisterAdminRequest {
    user_name: string
    password: string
    re_password: string
    email: string
}

// 注册管理员
export function registerAdminAPI(requestData: RegisterAdminRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/register-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
