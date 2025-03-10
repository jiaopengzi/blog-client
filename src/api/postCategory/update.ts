/**
 * @FilePath     : \blog-client\src\api\postCategory\update.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新文章分类
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdatePostCategoryRequest {
    id: string // 分类id
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
    parent?: string // 父级分类
}

// 更新文章分类
export function updatePostCategoryAPI(requestData: UpdatePostCategoryRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-category/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
