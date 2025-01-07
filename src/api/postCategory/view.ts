/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 11:35:00
 * @FilePath     : \blog-client\src\api\postCategory\view.ts
 * @Description  : 查看文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type PaginationRequest,request, routerGroup } from "@/api/request"
import type { Pagination,Res, ResPromise } from "@/api/response"
import type { DataWithImg } from "@/components/common"

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
    post_count_admin: string // 文章数量(管理员)
    parent: string // 父级分类
}

// 查看文章分类
export function viewPostCategoryAPI(
    requestData: PaginationRequest,
): ResPromise<Res<Pagination<PostCategory>>> {
    const urlStr = routerGroup + "/post-category/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 查看文章分类list
export function viewListPostCategoryAPI(): ResPromise<Res<PostCategory[]>> {
    const urlStr = routerGroup + "/post-category/view-list"
    return request({
        url: urlStr,
        method: "get",
    })
}
