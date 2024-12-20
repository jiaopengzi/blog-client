/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-20 12:28:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 14:06:34
 * @FilePath     : \blog-client\src\api\post\getPostCountByIsRecommended.ts
 * @Description  : 按照是否推荐统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface PostCountByIsRecommended {
    is_recommended: boolean // 是否推荐
    count: number // 文章数量
}

export function getPostCountByIsRecommendedAPI(): AxiosPromise<Res<PostCountByIsRecommended[]>> {
    const urlStr = routerGroup + "/post/count-by-is-recommended"
    return request({
        url: urlStr,
        method: "get",
    })
}
