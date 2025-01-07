/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-23 12:09:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-23 12:10:49
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonthAdmin.ts
 * @Description  : 按照作者统计文章数量(管理员)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
