/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 15:57:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:37:35
 * @FilePath     : \blog-client\src\api\postTag\update.ts
 * @Description  : 更新文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdatePostTagRequest {
    id: string // 标签id
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
}

// 更新文章标签
export function updatePostTagAPI(requestData: UpdatePostTagRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-tag/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
