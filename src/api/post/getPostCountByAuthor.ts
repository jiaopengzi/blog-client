/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-03 14:46:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-03 14:51:50
 * @FilePath     : \blog-client\src\api\post\getPostCountByAuthor.ts
 * @Description  : 按照作者统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"

export interface GetPostCountByAuthorResponse {
    code: number
    msg: string
    data: PostCountByAuthor[]
}

export function getPostCountByAuthorAPI(): AxiosPromise<GetPostCountByAuthorResponse> {
    const urlStr = routerGroup + "/post/count-by-author"
    return request({
        url: urlStr,
        method: "get",
    })
}

export interface PostCountByAuthor {
    post_author: string // 作者ID
    count: number // 文章数量
}
