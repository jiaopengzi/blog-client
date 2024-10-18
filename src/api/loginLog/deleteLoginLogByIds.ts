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

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface DeleteLoginLogByIDsRequest {
    id_list: string[] // 日志 id 列表
}

// 通过 ID 删除登录日志
export function DeleteLoginLogByIDsAPI(requestData: DeleteLoginLogByIDsRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/login-log/delete-by-ids"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
