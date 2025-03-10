/**
 * @FilePath     : \blog-client\src\api\captcha\send.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 验证码发送接口
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
