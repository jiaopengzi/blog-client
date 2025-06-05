/**
 * @FilePath     : \blog-client\src\api\post\update.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新文章
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type UpdatePostRequest } from "./common"

export interface UpdatePostResData extends StreamIdsStatusResWithId {
    updated_at: string
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
