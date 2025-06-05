/**
 * @FilePath     : \blog-client\src\api\loginLog\deleteLoginLogByDay.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 通过天删除登录日志
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteLoginLogByDayRequest {
    days_before: number // 天数
}

// 通过天删除登录日志
export function deleteLoginLogByDayAPI(requestData: DeleteLoginLogByDayRequest): ResPromise<Res<StreamIdsStatusResWithId >> {
    const urlStr = routerGroup + "/login-log/delete-by-day"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
