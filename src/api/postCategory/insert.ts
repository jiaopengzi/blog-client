/**
 * @FilePath     : \blog-client\src\api\postCategory\insert.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 插入文章分类
 */


import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
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
export function insertPostCategoryAPI(requestData: InsertPostCategoryRequest): ResPromise<Res<StreamIdsStatusResWithId>> {
    const urlStr = routerGroup + "/post-category/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
