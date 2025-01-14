/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-13 15:40:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-13 15:41:54
 * @FilePath     : \blog-client\src\api\user\registerAdmin.ts
 * @Description  : 注册管理员
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
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
export function registerAdminAPI(requestData: RegisterAdminRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/register-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
