/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-13 20:51:56
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-13 20:53:25
 * @FilePath     : \blog-client\src\api\post\update.ts
 * @Description  : 更新文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type InsertPostRequest } from "./insert"

// 更新文章
export function updatePostRequestAPI(requestData: InsertPostRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
