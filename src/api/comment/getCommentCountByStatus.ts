/*
 * FilePath    : blog-client\src\api\comment\getCommentCountByStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 按照评论状态统计评论数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { CommentReviewCode } from "./common"

export interface CommentCountByStatus {
    status: CommentReviewCode // 评论状态
    count: number // 评论数量
}

export function getCommentCountByStatusAPI(): ResPromise<Res<CommentCountByStatus[]>> {
    const urlStr = routerGroup + "/comment/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
