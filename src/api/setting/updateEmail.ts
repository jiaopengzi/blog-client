/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-20 11:28:20
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-20 11:29:42
 * @FilePath     : \blog-client\src\api\setting\updateEmail.ts
 * @Description  : 更新邮箱信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { GetEmailResponse } from "./getEmail" // 复用类型

export type UpdateEmailRequest = GetEmailResponse

// 更新邮箱信息
export function updateEmailAPI(requestData: UpdateEmailRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/option/update-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
