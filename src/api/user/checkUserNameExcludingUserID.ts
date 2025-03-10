/**
 * @FilePath     : \blog-client\src\api\user\checkUserNameExcludingUserID.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 校验用户名是否唯一 排除指定用户ID
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckUserNameExcludingUserIDRequest {
    excluding_user_id: string // 需要排除的用户id
    user_name: string
}

// 检测用户名是否存在
export function checkUserNameExcludingUserIDAPI(requestData: CheckUserNameExcludingUserIDRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/check-username-excluding-user-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
