/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-07 16:39:14
 * @FilePath     : \blog-client\src\api\category\view.ts
 * @Description  : 查看文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import type { DataWithImg, Pagination, PaginationRequest } from "@/components/common"
import { type Res } from "@/api/responseCode"

export interface ViewCategoryRequest extends PaginationRequest {}

// 每行数据类型
export interface Category extends DataWithImg {
    id: number // 标签id
    created_at: string // 创建时间
    name: string // tag名称
    description: string // 描述
    slug: string // 别名
    thumbnail: string // 缩略图
    order: number // 排序
    post_count: number // 文章数量
    parent: number // 父级分类
}

// 文章分类
export interface ViewCategoryResponse extends Res {
    data: Pagination<Category> // 根据实际返回的数据结构替换为更具体的类型
}

// 查看文章分类
export interface ViewListCategoryResponse extends Res {
    data: Category // 根据实际返回的数据结构替换为更具体的类型
}

// 查看文章标签
export function viewCategoryAPI(
    requestData: ViewCategoryRequest,
): AxiosPromise<ViewCategoryResponse> {
    const urlStr = routerGroup + "/post-category/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 查看文章标签list
export function viewListCategoryAPI(): AxiosPromise<ViewListCategoryResponse> {
    const urlStr = routerGroup + "/post-category/view-list"
    return request({
        url: urlStr,
        method: "get",
    })
}
