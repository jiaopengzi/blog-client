/*
 * FilePath    : blog-client\src\api\comment\viewByPostID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 普通用户查看文章评论
 */

import { type PaginationWithoutKeyWord, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { CommentRes } from "./common"

// 查看文章评论请求
export interface ViewCommentRequest extends PaginationWithoutKeyWord {
    post_id: string // 文章ID
}

// 查看文章
export function viewByPostIDAPI(requestData: ViewCommentRequest): ResPromise<Res<Pagination<CommentRes>>> {
    const urlStr = routerGroup + "/comment/view-by-post-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
