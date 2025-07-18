/**
 * @FilePath     : \blog-client\src\api\user\checkEmailExcludingUserID.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 校验邮箱是否唯一 排除指定用户ID
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckEmailExcludingUserIDRequest {
    excluding_user_id: string // 需要排除的用户id
    email: string
}

// 检测用户名是否存在
export function checkEmailExcludingUserIDAPI(requestData: CheckEmailExcludingUserIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/check-email-excluding-user-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
