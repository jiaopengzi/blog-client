/**
 * @FilePath     : \blog-client\src\api\user\editUserInfo.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 修改用户信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface EditUserInfoRequest {
    user_name: string
    nick_name: string
    sex: string
    description: string
}

// 注册
export function editUserInfoAPI(requestData: EditUserInfoRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/info-edit"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
