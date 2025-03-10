/**
 * @FilePath     : \blog-client\src\utils\msg.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 消息提示
 */

import type { Res } from "@/api/response"
import { handleResErr, ResponseCode } from "@/api/response"
import { formatDurationTime } from "@/utils/dateTime"

// 获取用户禁用信息
export function getUserForbiddenMsg(res: Res<number>) {
    // 小于等于7天的禁用时间，显示倒计时, 大于7天的禁用时间，显示禁用信息
    if (res.code === ResponseCode.UserForbidden && res.data && res.data <= 60 * 60 * 24 * 7) {
        const countdown = formatDurationTime(res.data)
        return `${res.msg}, ${countdown} 后解禁!` // 占位符替换
    }

    // 客户端IP请求频繁 和 客户端ID请求频繁
    if ((res.code === ResponseCode.ClientIPTooManyRequests || res.code === ResponseCode.ClientIDTooManyRequests) && res.data) {
        return handleResErr(res)
    }
    return res.msg
}
