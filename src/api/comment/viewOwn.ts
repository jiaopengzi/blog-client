/*
 * FilePath    : blog-client\src\api\comment\viewOwn.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自己的评论
 */

import { request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { CommentResAdmin } from "./common"
import type { ViewCommentByAdminRequest } from "./viewByAdmin"

// 自己的评论请求
export type ViewCommentOwnRequest = ViewCommentByAdminRequest

// 自己的评论响应
export type CommentResOwn = CommentResAdmin

// 查看自己的评论
export function viewCommentOwnAPI(requestData: ViewCommentOwnRequest): ResPromise<Res<Pagination<CommentResOwn>>> {
    const urlStr = routerGroup + "/comment/view-own"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
