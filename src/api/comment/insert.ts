/*
 * FilePath    : blog-client\src\api\comment\insert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 插入评论
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { CommentReviewCode } from "./common"

// 插入评论请求
export interface InsertCommentRequest {
    reply_to_id?: string // 回复的评论ID
    post_id: string
    content: string
}

// 插入评论响应
export interface InsertCommentResData extends StreamIdsStatusResWithId {
    id: string
    created_at: string
    updated_at: string
    status: CommentReviewCode
}

// 插入评论
export function insertCommentAPI(requestData: InsertCommentRequest): ResPromise<Res<InsertCommentResData>> {
    const urlStr = routerGroup + "/comment/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 插入评论(管理员)
export function insertCommentAdminAPI(requestData: InsertCommentRequest): ResPromise<Res<InsertCommentResData>> {
    const urlStr = routerGroup + "/comment/insert-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
