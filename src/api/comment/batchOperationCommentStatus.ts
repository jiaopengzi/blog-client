/*
 * FilePath    : blog-client\src\api\comment\batchOperationCommentStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 批量操作评论状态
 */

import type { StreamIdStatusResWithId } from "@/api/helper/getStreamIDStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { CommentReviewCode } from "./common"

export interface CommentStatusOperation {
    id: string // 评论ID
    post_status: CommentReviewCode // 评论状态
}

export interface BatchOperationCommentStatusRequest {
    operation_list: CommentStatusOperation[] // 操作列表
}

// 批量操作评论响应
export type BatchOperationCommentStatusRes = StreamIdStatusResWithId

// 批量操作评论状态
export function batchOperationCommentStatusAPI(requestData: BatchOperationCommentStatusRequest): ResPromise<Res<BatchOperationCommentStatusRes>> {
    const urlStr = routerGroup + "/comment/batch-operation-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
