/*
 * FilePath    : blog-client-nuxt\src\api\post\checkPostSlug.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查文章别名是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckPostSlugRequest {
    slug: string // post 别名
}

// 检查 post 别名是否存在
export function checkPostSlugAPI(requestData: CheckPostSlugRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post/check-post-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
