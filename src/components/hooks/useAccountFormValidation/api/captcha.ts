/**
 * @FilePath     : \blog-client\src\components\hooks\useAccountFormValidation\api\captcha.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 验证码相关API
 */

import { captchaCheckAPI, type CaptchaCheckRequest } from "@/api/captcha/check"
import { captchaSendAPI, type CaptchaSendRequest } from "@/api/captcha/send"
import { CaptchaPurpose } from "@/api/common"
import { StreamStatus } from "@/api/helper/getStreamIDsStatus"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"

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

        if (data.code === ResponseCode.CaptchaSendSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (data.data && data.data.stream_items) {
                const status = await pollingGetStreamIDsStatus(data.data.stream_items)
                if (status === StreamStatus.HandleFailed) {
                    throw new Error("发送验证码过程中出现错误，请稍后重试")
                }
            }
        }

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
export async function checkCaptcha(email: string, captcha: string, purpose: CaptchaPurpose): Promise<void> {
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
