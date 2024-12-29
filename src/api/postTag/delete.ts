/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 15:59:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 13:12:27
 * @FilePath     : \blog-client\src\api\postTag\delete.ts
 * @Description  : 删除文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeletePostTagRequest {
    id_list: string[] // tag名称
}

// 删除文章标签
export function deletePostTagAPI(requestData: DeletePostTagRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
