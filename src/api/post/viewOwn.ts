/*
 * FilePath    : blog-client\src\api\post\viewOwn.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自己的文章
 */

import { request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import { type PostResPaginationByAdmin } from "./common"
import type { ViewPostByAdminRequest } from "./viewByAdmin"

// 自己的文章请求
export type ViewPostOwnRequest = ViewPostByAdminRequest

// 自己的文章响应
export type PostResPaginationOwn = PostResPaginationByAdmin

// 查看自己的文章
export function viewPostOwnAPI(requestData: ViewPostOwnRequest): ResPromise<Res<Pagination<PostResPaginationOwn>>> {
    const urlStr = routerGroup + "/post/view-own"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
