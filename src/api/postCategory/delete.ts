/**
 * @FilePath     : \blog-client\src\api\postCategory\delete.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除文章分类
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeletePostCategoryRequest {
    id_list: string[] // 分类ID列表
}

// 删除文章分类
export function deletePostCategoryAPI(requestData: DeletePostCategoryRequest): ResPromise<Res<StreamIdsStatusResWithId>> {
    const urlStr = routerGroup + "/post-category/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
