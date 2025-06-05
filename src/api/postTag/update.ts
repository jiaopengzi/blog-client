/**
 * @FilePath     : \blog-client\src\api\postTag\update.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新文章标签
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
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
export function updatePostTagAPI(requestData: UpdatePostTagRequest): ResPromise<Res<StreamIdsStatusResWithId>> {
    const urlStr = routerGroup + "/post-tag/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
