/*
 * FilePath    : blog-client\src\api\link\delete.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除链接
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteLinkRequest {
    id_list: string[]
}

// 删除链接
export function deleteLinkAPI(requestData: DeleteLinkRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/link/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
