/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 11:20:24
 * @FilePath     : \blog-client\src\api\postCategory\view.ts
 * @Description  : 查看文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import type { DataWithImg, Pagination, PaginationRequest } from "@/components/common"
import { type Res } from "@/api/responseCode"

export interface ViewPostCategoryRequest extends PaginationRequest {}

// 每行数据类型
export interface PostCategory extends DataWithImg {
    id: string // 分类id
    created_at: string // 创建时间
    name: string // tag名称
    description: string // 描述
    slug: string // 别名
    thumbnail: string // 缩略图
    order: string // 排序
    post_count: string // 文章数量
    parent: string // 父级分类
}

// 文章分类
export interface ViewPostCategoryResponse extends Res {
    data: Pagination<PostCategory>
}

// 查看文章分类
export interface ViewListPostCategoryResponse extends Res {
    data: PostCategory[]
}

// 查看文章分类
export function viewPostCategoryAPI(
    requestData: ViewPostCategoryRequest,
): AxiosPromise<ViewPostCategoryResponse> {
    const urlStr = routerGroup + "/post-category/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 查看文章分类list
export function viewListPostCategoryAPI(): AxiosPromise<ViewListPostCategoryResponse> {
    const urlStr = routerGroup + "/post-category/view-list"
    return request({
        url: urlStr,
        method: "get",
    })
}
