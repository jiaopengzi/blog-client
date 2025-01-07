/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-13 20:51:56
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:55:27
 * @FilePath     : \blog-client\src\api\post\update.ts
 * @Description  : 更新文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type UpdatePostRequest } from "./common"

export interface UpdatePostResData {
    updated_at: string
}

// 更新文章
export function updatePostAPI(requestData: UpdatePostRequest): ResPromise<Res<UpdatePostResData>> {
    const urlStr = routerGroup + "/post/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
