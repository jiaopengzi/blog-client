/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-23 17:30:34
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 13:18:23
 * @FilePath     : \blog-client\src\api\post\delete.ts
 * @Description  : 删除文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeletePostRequest {
    id_list: string[]
}

// 删除文章
export function deletePostAPI(requestData: DeletePostRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
