/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-14 14:54:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-15 12:21:56
 * @FilePath     : \blog-client\src\api\post\viewByIDAdmin.ts
 * @Description  : 查看文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
