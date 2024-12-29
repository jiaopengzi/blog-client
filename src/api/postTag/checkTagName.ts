/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 17:22:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-04 17:24:00
 * @FilePath     : \blog-client\src\api\postTag\checkTagName.ts
 * @Description  : 检查 tag 名称是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagNameRequest {
    name: string // tag名称
}

// 检查 tag 名称是否存在
export function checkTagNameAPI(requestData: CheckTagNameRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-tag/check-tag-name"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
