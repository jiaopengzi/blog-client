/**
 * @FilePath     : \blog-client\src\api\postTag\insert.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 插入文章标签
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface InsertPostTagRequest {
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
}

// 插入文章标签
export function insertPostTagAPI(requestData: InsertPostTagRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-tag/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
