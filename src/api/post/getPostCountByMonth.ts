/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonth.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照作者统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PostCountByMonth {
    year: number // 年
    month: number // 月
    count: number // 文章数量
}

export function getPostCountByMonthAPI(): ResPromise<Res<PostCountByMonth[]>> {
    const urlStr = routerGroup + "/post/count-by-month"
    return request({
        url: urlStr,
        method: "get",
    })
}
