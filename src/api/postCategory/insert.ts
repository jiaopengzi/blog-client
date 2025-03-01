/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 11:20:41
 * @FilePath     : \blog-client\src\api\postCategory\insert.ts
 * @Description  : 插入文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface InsertPostCategoryRequest {
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
    parent?: string // 父级分类
}

// 插入文章分类
export function insertPostCategoryAPI(requestData: InsertPostCategoryRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-category/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
