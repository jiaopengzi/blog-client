/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 15:53:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:51:54
 * @FilePath     : \blog-client\src\api\postTag\insert.ts
 * @Description  : 插入文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
