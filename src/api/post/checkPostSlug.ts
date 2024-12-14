/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 17:24:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-04 17:25:20
 * @FilePath     : \blog-client\src\api\postPost\checkPostSlug.ts
 * @Description  : 检查 文章 别名是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface CheckPostSlugRequest {
    slug: string // post别名
}

// 检查 post 名称是否存在
export function checkPostSlugAPI(requestData: CheckPostSlugRequest): AxiosPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post/check-post-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
