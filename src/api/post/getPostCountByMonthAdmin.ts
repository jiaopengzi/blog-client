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

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PostCountByMonth } from "./getPostCountByMonth"

export function getPostCountByMonthAdminAPI(): AxiosPromise<Res<PostCountByMonth[]>> {
    const urlStr = routerGroup + "/post/count-by-month-admin"
    return request({
        url: urlStr,
        method: "get",
    })
}
