/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-22 14:41:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 11:05:45
 * @FilePath     : \blog-client\src\utils\msg.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { type Res } from "@/api/responseCode"
import { formatDurationTime } from "@/utils/dateTime"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"

// 获取用户禁用信息
export function getUserForbiddenMsg(res: Res<number>) {
    // 小于等于7天的禁用时间，显示倒计时, 大于7天的禁用时间，显示禁用信息
    if (res.code === ResponseCode.UserForbidden && res.data && res.data <= 60 * 60 * 24 * 7) {
        const countdown = formatDurationTime(res.data)
        return `${res.msg}, ${countdown} 后解禁!` // 占位符替换
    }

    // 客户端IP请求频繁 和 客户端ID请求频繁
    if (
        (res.code === ResponseCode.ClientIPTooManyRequests ||
            res.code === ResponseCode.ClientIDTooManyRequests) &&
        res.data
    ) {
        return handleErrInfo(res)
    }
    return res.msg
}
