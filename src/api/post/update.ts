/**
 * @FilePath     : \blog-client\src\api\post\update.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新文章
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type UpdatePostRequest } from "./common"

export interface UpdatePostResData extends StreamsStatusRes {
    updated_at: string
    is_paid: boolean // 是否已付费
}

// 更新文章
export function updatePostAPI(requestData: UpdatePostRequest): ResPromise<Res<UpdatePostResData>> {
    const urlStr = routerGroup + "/post/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
