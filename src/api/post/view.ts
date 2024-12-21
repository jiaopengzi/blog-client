/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-12 16:41:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-21 16:06:48
 * @FilePath     : \blog-client\src\api\post\view.ts
 * @Description  : 查看文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import type { Pagination, PaginationRequest } from "@/components/common"

// 管理员查看文章请求
export interface ViewPostRequest extends PaginationRequest {
    post_author?: string // 文章作者
    year?: number // 文章年份
    month?: number // 文章月份
    post_category_id?: string // 文章分类ID
    post_tag_id?: string // 文章标签ID
}

// 查看文章
export function viewPostAPI(
    requestData: PaginationRequest,
): AxiosPromise<Res<Pagination<ViewPostRequest>>> {
    const urlStr = routerGroup + "/post/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
