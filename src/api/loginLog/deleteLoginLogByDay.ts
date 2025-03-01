/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-28 21:48:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:40:55
 * @FilePath     : \blog-client\src\api\loginLog\deleteLoginLogByDay.ts
 * @Description  : 通过天删除登录日志
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteLoginLogByDayRequest {
    days_before: number // 天数
}

// 通过天删除登录日志
export function deleteLoginLogByDayAPI(requestData: DeleteLoginLogByDayRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/login-log/delete-by-day"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
