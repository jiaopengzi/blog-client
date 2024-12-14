/**
 * @Status       : jiaopengzi
 * @Date         : 2024-12-03 14:51:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-03 17:33:41
 * @FilePath     : \blog-client\src\api\post\getPostCountByStatus.ts
 * @Description  : 按照文章状态统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { PostStatusCode } from "@/api/post/common"
import { type Res } from "@/api/responseCode"

export interface PostCountByStatus {
    post_status: PostStatusCode // 文章状态
    count: number // 文章数量
}

export function getPostCountByStatusAPI(): AxiosPromise<Res<PostCountByStatus[]>> {
    const urlStr = routerGroup + "/post/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
