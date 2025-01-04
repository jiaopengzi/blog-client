/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-23 15:43:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 17:29:37
 * @FilePath     : \blog-client\src\api\post\viewByAdmin.ts
 * @Description  : 管理员查看文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup, type PaginationRequest } from "@/api/request"
import type { Res, ResPromise, Pagination } from "@/api/response"
import { type PostResPaginationByAdmin, CustomFields } from "./common"

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
    is_pinned?: boolean // 是否置顶
    is_recommended?: boolean // 是否推荐
}

// 查看文章
export function viewPostByAdminAPI(
    requestData: ViewPostByAdminRequest,
): ResPromise<Res<Pagination<PostResPaginationByAdmin>>> {
    const urlStr = routerGroup + "/post/view-by-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
