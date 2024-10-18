/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-28 21:48:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-28 21:49:51
 * @FilePath     : \blog-client\src\api\loginLog\deleteLoginLogByDay.ts
 * @Description  : 通过天删除登录日志
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface DeleteLoginLogByDayRequest {
    days_before: number // 天数
}

// 通过天删除登录日志
export function DeleteLoginLogByDayAPI(requestData: DeleteLoginLogByDayRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/login-log/delete-by-day"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
