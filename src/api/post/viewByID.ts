/*
 * FilePath    : blog-client\src\api\post\viewByID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostResByID } from "./common"

export interface ViewPostByIDRequest {
    post_id: string // 文章ID
    password?: string // 文章密码
}

// 查看文章
export function viewPostByIDAPI(requestData: ViewPostByIDRequest): ResPromise<Res<PostResByID>> {
    const urlStr = routerGroup + "/post/view-by-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 查看文章(不含内容)
export function viewPostByIDWithoutContentAPI(requestData: ViewPostByIDRequest): ResPromise<Res<PostResByID>> {
    const urlStr = routerGroup + "/post/view-by-id-without-content"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
