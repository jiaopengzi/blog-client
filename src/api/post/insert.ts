/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-23 16:02:36
 * @FilePath     : \blog-client\src\api\post\insert.ts
 * @Description  : 插入文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type UpsertPostRequest } from "./common"

// 插入文章响应
export interface InsertPostResponse extends Res {
    data: {
        id: string
    }
}

// 插入文章
export function insertPostRequestAPI(
    requestData: UpsertPostRequest,
): AxiosPromise<InsertPostResponse> {
    const urlStr = routerGroup + "/post/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
