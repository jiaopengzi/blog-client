/**
 * @FilePath     : \blog-client\src\api\user\getUserPublicInfoByUserName.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 通过用户名获取用户公开信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UserPublicInfo {
    id: string
    created_at: string
    user_name: string
    user_display_name: string
    user_avatar: string
    post: number
    role: string
    description: string
    sex: string
}

export interface GetUserPublicInfoByUserNameRequest {
    user_name: string
}

export function getUserPublicInfoByUserNameAPI(requestData: GetUserPublicInfoByUserNameRequest): ResPromise<Res<UserPublicInfo>> {
    const urlStr = routerGroup + "/user/public-info-by-username"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
