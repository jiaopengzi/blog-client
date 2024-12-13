/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-14 14:54:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 16:54:18
 * @FilePath     : \blog-client\src\api\post\viewByID.ts
 * @Description  : 查看文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PostResByAdmin } from "./common"

export interface ViewPostByIDRequest {
    post_id: string // 文章ID
}

export interface ViewPostResponse extends Res {
    data: PostResByAdmin
}

// 查看文章
export function viewPostByIDAPI(requestData: ViewPostByIDRequest): AxiosPromise<ViewPostResponse> {
    const urlStr = routerGroup + "/post/view-by-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
