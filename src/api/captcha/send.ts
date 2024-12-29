/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 13:07:57
 * @FilePath     : \blog-client\src\api\captcha\send.ts
 * @Description  : 验证码发送
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CaptchaSendRequest {
    email: string
    purpose: string // 验证码用途
}

// 检测验证码是否正确
export function captchaSendAPI(requestData: CaptchaSendRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/captcha/send"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
