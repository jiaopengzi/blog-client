/**
 * @FilePath     : \blog-client\src\api\loginLog\deleteLoginLogByIds.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除登录日志
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteLoginLogByIDsRequest {
    id_list: string[] // 日志 id 列表
}

// 通过 ID 删除登录日志
export function deleteLoginLogByIDsAPI(requestData: DeleteLoginLogByIDsRequest): ResPromise<Res<StreamIdsStatusResWithId >> {
    const urlStr = routerGroup + "/login-log/delete-by-ids"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
