/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-28 19:33:06
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-28 20:59:14
 * @FilePath     : \blog-client\src\api\login_log\deleteLoginLogByIds.ts
 * @Description  : 删除登录日志
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteLoginLogByIDsRequest {
    id_list: string[] // 日志 id 列表
}

// 通过 ID 删除登录日志
export function deleteLoginLogByIDsAPI(requestData: DeleteLoginLogByIDsRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/login-log/delete-by-ids"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
