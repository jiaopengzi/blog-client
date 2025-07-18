/**
 * @FilePath     : \blog-client\src\api\postTag\checkTagName.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查 tag 名称是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagNameRequest {
    name: string // tag名称
}

// 检查 tag 名称是否存在
export function checkTagNameAPI(requestData: CheckTagNameRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/check-tag-name"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
