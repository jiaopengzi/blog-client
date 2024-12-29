/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 15:40:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:50:35
 * @FilePath     : \blog-client\src\api\user\getUserInfoByUserID.ts
 * @Description  : 通过用户ID 获取用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import type { UserInfo } from "@/api/user/getUserInfo"

export interface GetUserInfoByUserIDRequest {
    user_id: string // 用户id
}

// 获取用户信息
export function getUserInfoByUserIDAPI(
    requestData: GetUserInfoByUserIDRequest,
): ResPromise<Res<UserInfo>> {
    const urlStr = routerGroup + "/user/info-by-user-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
