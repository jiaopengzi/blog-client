/*
 * FilePath    : blog-client\src\api\comment\delete.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除评论
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteCommentRequest {
    id_list: string[]
}

// 删除评论响应
export type DeleteCommentRes = StreamsStatusRes

// 删除评论
export function deleteCommentAPI(requestData: DeleteCommentRequest): ResPromise<Res<DeleteCommentRes>> {
    const urlStr = routerGroup + "/comment/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 管理员删除评论
export function deleteCommentAdminAPI(requestData: DeleteCommentRequest): ResPromise<Res<DeleteCommentRes>> {
    const urlStr = routerGroup + "/comment/delete-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
