/**
 * @FilePath     : \blog-client\src\api\user\getUserInfoByUserID.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 通过用户ID 获取用户信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import type { UserInfo } from "@/api/user/getUserInfo"

export interface GetUserInfoByUserIDRequest {
    user_id: string // 用户id
}

// 获取用户信息
export function getUserInfoByUserIDAPI(requestData: GetUserInfoByUserIDRequest): ResPromise<Res<UserInfo>> {
    const urlStr = routerGroup + "/user/info-by-user-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
