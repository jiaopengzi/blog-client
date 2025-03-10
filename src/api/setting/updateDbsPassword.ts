/**
 * @FilePath     : \blog-client\src\api\setting\updateDbsPassword.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新数据库密码
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { SetupRequest } from "./setup" // 复用类型

type UpdateDbsPasswordRequest = SetupRequest

// 更新数据库密码
export function updateDbsPasswordAPI(requestData: UpdateDbsPasswordRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/option/update-dbs-password"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
