/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-27 15:51:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:49:58
 * @FilePath     : \blog-client\src\api\user\editUserInfo.ts
 * @Description  :  修改用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
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
export function editUserInfoAPI(requestData: EditUserInfoRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/info-edit"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
