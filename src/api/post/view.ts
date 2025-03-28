/**
 * @FilePath     : \blog-client\src\api\post\view.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 查看文章
 */

import type { PostResPagination } from "@/api/post/common"
import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

// 查看文章请求
export interface ViewPostRequest extends PaginationRequest {
    post_author?: string // 文章作者
    year?: number // 文章年份
    month?: number // 文章月份
    post_category_id?: string // 文章分类ID
    post_category_slug?: string // 文章分类别名
    post_tag_id?: string // 文章标签ID
    post_tag_slug?: string // 文章标签别名

    highlight_fields?: string[] // 高亮字段 可以为空
    pre_tags?: string // 高亮前缀 可以为空
    post_tags?: string // 高亮后缀 可以为空
}

// 查看文章
export function viewPostAPI(requestData: PaginationRequest): ResPromise<Res<Pagination<PostResPagination>>> {
    const urlStr = routerGroup + "/post/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
