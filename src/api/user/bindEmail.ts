/**
 * @FilePath     : \blog-client\src\api\user\bindEmail.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 绑定邮箱
 */

// import request from '../request'
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface BindEmailRequest {
    email: string
    captcha: string
}

// 注册
export function bindEmailAPI(requestData: BindEmailRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/bind-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
