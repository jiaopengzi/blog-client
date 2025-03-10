/**
 * @FilePath     : \blog-client\src\api\captcha\check.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 验证码校验接口
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CaptchaCheckRequest {
    email: string
    captcha: string
    purpose: string // 验证码用途
}

// 检测验证码是否正确
export function captchaCheckAPI(requestData: CaptchaCheckRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/captcha/check"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
