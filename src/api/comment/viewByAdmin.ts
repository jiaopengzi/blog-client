/*
 * FilePath    : blog-client\src\api\comment\viewByAdmin.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 管理员查看评论
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { CommentResAdmin, CommentReviewCode } from "./common"

// 管理员查看文章评论请求
export interface ViewCommentByAdminRequest extends PaginationRequest {
    post_id?: string // 文章ID
    user_id?: string // 用户ID
    status?: CommentReviewCode // 评论状态
}

// 查看文章评论
export function viewCommentByAdminAPI(requestData: ViewCommentByAdminRequest): ResPromise<Res<Pagination<CommentResAdmin>>> {
    const urlStr = routerGroup + "/comment/view-by-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
