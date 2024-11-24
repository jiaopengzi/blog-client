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

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface CheckTagNameExcludingIDRequest {
    excluding_id: string // 不包含的ID
    name: string // tag名称
}

// 检查 tag 名称是否存在
export function checkTagNameExcludingIDAPI(
    requestData: CheckTagNameExcludingIDRequest,
): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post-tag/check-tag-name-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
