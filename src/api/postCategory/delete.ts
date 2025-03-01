/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:31:09
 * @FilePath     : \blog-client\src\api\postCategory\delete.ts
 * @Description  : 删除文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeletePostCategoryRequest {
    id_list: string[] // 分类ID列表
}

// 删除文章分类
export function deletePostCategoryAPI(requestData: DeletePostCategoryRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-category/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
