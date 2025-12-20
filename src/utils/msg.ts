/**
 * @FilePath     : \blog-client\src\utils\msg.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 消息提示
 */

import type { Res } from "@/api/response"
import { handleResErr, ResponseCode } from "@/api/response"
import { type AccessTokenResponse } from "@/api/user/common"
import { formatDurationTime } from "@/utils/dateTime"

// 获取用户禁用信息
export function getUserForbiddenMsg(res: Res<AccessTokenResponse | number>) {
    // 处理数字
    if (typeof res.data === "number" && res.code === ResponseCode.UserForbidden) {
        // 格式化禁用消息
        const { isFormat, msg } = isFormatMsg(res.data, res.msg)
        if (isFormat) {
            return msg
        }
    }

    // 处理 AccessTokenResponse 对象
    if (typeof res.data === "object" && res.code === ResponseCode.UserForbidden && res.data && res.data.disable_expires_at) {
        // 将 res.data.disable_expires_at 解析为数字
        const disableExpiresAtNum = Number(res.data.disable_expires_at)
        if (isNaN(disableExpiresAtNum)) {
            return res.msg
        }

        // 格式化禁用消息
        const { isFormat, msg } = isFormatMsg(disableExpiresAtNum, res.msg)
        if (isFormat) {
            return msg
        }
    }

    // 客户端IP请求频繁 和 客户端ID请求频繁
    if ((res.code === ResponseCode.ClientIPTooManyRequests || res.code === ResponseCode.ClientIDTooManyRequests) && res.data) {
        return handleResErr(res)
    }

    return res.msg
}

// 格式化禁用消息
function isFormatMsg(disableExpiresAtNum: number, msg: string) {
    // 小于等于7天的禁用时间，显示倒计时, 大于7天的禁用时间，显示禁用信息
    if (disableExpiresAtNum <= 60 * 60 * 24 * 7) {
        const countdown = formatDurationTime(disableExpiresAtNum)
        return { isFormat: true, msg: `${msg}, ${countdown} 后解禁!` } // 占位符替换
    }

    return { isFormat: false, msg } // 占位符替换
}
