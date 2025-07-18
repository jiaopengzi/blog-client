/**
 * @FilePath     : \blog-client\src\api\user\checkUserName.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户查重
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckUserNameRequest {
    user_name: string
}

// 检测用户名是否存在
export function checkUserNameAPI(requestData: CheckUserNameRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/check-username"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
