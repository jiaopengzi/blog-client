/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:54:04
 * @FilePath     : \blog-client\src\api\post\insert.ts
 * @Description  : 插入文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type InsertPostRequest } from "./common"

// 插入文章响应
export interface InsertPostResData {
    id: string
    created_at: string
    updated_at: string
}

// 插入文章
export function insertPostAPI(requestData: InsertPostRequest): ResPromise<Res<InsertPostResData>> {
    const urlStr = routerGroup + "/post/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
