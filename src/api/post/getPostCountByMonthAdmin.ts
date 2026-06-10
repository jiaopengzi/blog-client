/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonthAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照作者统计文章数量(管理员)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostType } from "./common"
import { type PostCountByMonth } from "./getPostCountByMonth"

/**
 * getPostCountByMonthAdminAPI 获取后台指定文章类型的月份统计。
 * @param postType - 文章类型, 未传时沿用后端默认的 post。
 * @returns 月份维度的文章数量统计结果。
 */
export function getPostCountByMonthAdminAPI(postType?: PostType): ResPromise<Res<PostCountByMonth[]>> {
    const urlStr = routerGroup + "/post/count-by-month-admin"
    return request({
        url: urlStr,
        method: "get",
        params: postType ? { post_type: postType } : void 0,
    })
}
