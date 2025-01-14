/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-13 14:24:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-13 15:26:40
 * @FilePath     : \blog-client\src\components\hooks\useAccountFormValidation\api\captcha.ts
 * @Description  : 验证码相关API
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { captchaCheckAPI, type CaptchaCheckRequest } from "@/api/captcha/check"
import { captchaSendAPI, type CaptchaSendRequest } from "@/api/captcha/send"
import { CaptchaPurpose } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"

/**
 * @description: 校验发送验证码
 * @param email 邮箱
 * @param purpose 验证码用途
 */
export async function checkSendCaptcha(email: string, purpose: CaptchaPurpose): Promise<void> {
    try {
        // 创建请求对象
        const req: CaptchaSendRequest = {
            email: email,
            purpose: purpose,
        }

        const { data } = await captchaSendAPI(req)

        if (data.code !== ResponseCode.CaptchaSendSuccess) {
            const errMsg = handleResErr(data)
            throw new Error(errMsg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}

/**
 * @description: 校验验证码
 * @param email 邮箱
 * @param captcha 验证码
 * @param purpose 验证码用途
 */
export async function checkCaptcha(
    email: string,
    captcha: string,
    purpose: CaptchaPurpose,
): Promise<void> {
    try {
        // 创建请求对象
        const req: CaptchaCheckRequest = {
            email: email,
            captcha: captcha,
            purpose: purpose,
        }
        const res = await captchaCheckAPI(req)

        if (res.data.code !== ResponseCode.CaptchaCheckSuccess) {
            const errMsg = handleResErr(res)
            throw new Error(errMsg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}
