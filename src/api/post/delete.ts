/**
 * @FilePath     : \blog-client\src\api\post\delete.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除文章
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeletePostRequest {
    id_list: string[]
}

// 删除文章
export function deletePostAPI(requestData: DeletePostRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/post/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
