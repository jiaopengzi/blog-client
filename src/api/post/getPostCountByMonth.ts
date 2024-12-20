/**
 * @Month       : jiaopengzi
 * @Date         : 2024-12-03 14:46:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 11:55:29
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonth.ts
 * @Description  : 按照作者统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface PostCountByMonth {
    year: number // 年
    month: number // 月
    count: number // 文章数量
}

export function getPostCountByMonthAPI(): AxiosPromise<Res<PostCountByMonth[]>> {
    const urlStr = routerGroup + "/post/count-by-month"
    return request({
        url: urlStr,
        method: "get",
    })
}
