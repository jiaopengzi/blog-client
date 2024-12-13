/**
 * @Month       : jiaopengzi
 * @Date         : 2024-12-03 14:46:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-03 14:54:03
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonth.ts
 * @Description  : 按照作者统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface GetPostCountByMonthResponse extends Res {
    data: PostCountByMonth[]
}

export function getPostCountByMonthAPI(): AxiosPromise<GetPostCountByMonthResponse> {
    const urlStr = routerGroup + "/post/count-by-month"
    return request({
        url: urlStr,
        method: "get",
    })
}

export interface PostCountByMonth {
    year: string // 年
    month: string // 月
    count: number // 文章数量
}
