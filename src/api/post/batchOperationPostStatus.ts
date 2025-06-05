/**
 * @FilePath     : \blog-client\src\api\post\batchOperationPostStatus.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 批量操作文章状态
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { PostStatusCode } from "./common"

export interface PostStatusOperation {
    id: string // 文章ID
    post_status: PostStatusCode // 文章状态
}

export interface BatchOperationPostStatusRequest {
    operation_list: PostStatusOperation[] // 操作列表
}

// 批量操作文章状态
export function batchOperationPostStatusAPI(requestData: BatchOperationPostStatusRequest): ResPromise<Res<StreamIdsStatusResWithId>> {
    const urlStr = routerGroup + "/post/batch-operation-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
