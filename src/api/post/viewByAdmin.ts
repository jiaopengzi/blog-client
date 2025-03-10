/**
 * @FilePath     : \blog-client\src\api\post\viewByAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 管理员查看文章
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import { CustomFields, type PostResPaginationByAdmin } from "./common"

// 管理员查看文章请求
export interface ViewPostByAdminRequest extends PaginationRequest {
    post_author?: string // 文章作者
    post_status?: number // 文章状态
    year?: number // 文章年份
    month?: number // 文章月份
    post_category_id?: string // 文章分类ID
    post_tag_id?: string // 文章标签ID
    custom_filed?: CustomFields // 自定义字段
    custom_filed_min?: string // 自定义字段最小值
    custom_filed_max?: string // 自定义字段最大值
    is_pinned?: number // 是否置顶
    is_recommended?: number // 是否推荐
}

// 查看文章
export function viewPostByAdminAPI(requestData: ViewPostByAdminRequest): ResPromise<Res<Pagination<PostResPaginationByAdmin>>> {
    const urlStr = routerGroup + "/post/view-by-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
