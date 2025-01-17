/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-17 12:15:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-17 12:19:01
 * @FilePath     : \blog-client\src\api\setting\updateDbsPassword.ts
 * @Description  : 更新数据库密码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
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
