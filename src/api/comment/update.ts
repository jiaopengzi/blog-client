/*
 * FilePath    : blog-client\src\api\comment\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新审核评论
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { CommentPinnedCode, CommentReviewCode } from "./common"

// 更新审核评论请求
export interface UpdateCommentRequest {
    id: string
    content: string
    status: CommentReviewCode
    is_pinned: CommentPinnedCode
}

// 更新审核评论
export function updateCommentAPI(requestData: UpdateCommentRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/comment/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
