/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 14:45:36
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

// 获取用户信息响应类型
export interface ViewCategoryResponse extends Res {
    data: Pagination<Category> // 根据实际返回的数据结构替换为更具体的类型
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
