/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-12 16:41:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-24 15:20:20
 * @FilePath     : \blog-client\src\api\post\view.ts
 * @Description  : 查看文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import type { Pagination, PaginationRequest } from "@/components/common"
import type { PostResPagination } from "@/api/post/common"

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
): ResPromise<Res<Pagination<PostResPagination>>> {
    const urlStr = routerGroup + "/post/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
