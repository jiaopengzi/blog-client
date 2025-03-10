/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonthAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照作者统计文章数量(管理员)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostCountByMonth } from "./getPostCountByMonth"

export function getPostCountByMonthAdminAPI(): ResPromise<Res<PostCountByMonth[]>> {
    const urlStr = routerGroup + "/post/count-by-month-admin"
    return request({
        url: urlStr,
        method: "get",
    })
}
