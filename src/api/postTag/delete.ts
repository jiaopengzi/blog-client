/**
 * @FilePath     : \blog-client\src\api\postTag\delete.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除文章标签
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeletePostTagRequest {
    id_list: string[] // tag名称
}

// 删除文章标签
export function deletePostTagAPI(requestData: DeletePostTagRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
