/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:39:50
 * @FilePath     : \blog-client\src\api\captcha\check.ts
 * @Description  : 验证码校验
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
