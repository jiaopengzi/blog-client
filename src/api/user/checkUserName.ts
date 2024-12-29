/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-14 17:04:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:54:11
 * @FilePath     : \blog-client\src\api\user\checkUserName.ts
 * @Description  : 用户查重
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckUserNameRequest {
    user_name: string
}

// 检测用户名是否存在
export function checkUserNameAPI(requestData: CheckUserNameRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/check-username"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
