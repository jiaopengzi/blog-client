/**
 * @FilePath     : \blog-client\src\api\post\viewByIDAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 查看文章
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostResByAdmin } from "./common"

export interface ViewPostByIDRequest {
    post_id: string // 文章ID
}

// 查看文章
export function viewPostByIDAdminAPI(requestData: ViewPostByIDRequest): ResPromise<Res<PostResByAdmin>> {
    const urlStr = routerGroup + "/post/view-by-id-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
