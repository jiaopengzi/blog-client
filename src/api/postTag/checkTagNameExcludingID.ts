/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-05 16:06:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-05 16:08:40
 * @FilePath     : \blog-client\src\api\postTag\checkTagNameExcludingID.ts
 * @Description  : 检查 tag 名称是否存在 (不包含ID)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagNameExcludingIDRequest {
    excluding_id: string // 不包含的ID
    name: string // tag名称
}

// 检查 tag 名称是否存在
export function checkTagNameExcludingIDAPI(
    requestData: CheckTagNameExcludingIDRequest,
): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-tag/check-tag-name-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
