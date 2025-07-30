/*
 * FilePath    : blog-client\src\api\post\pagePathToID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通过自定义页面的路径获取文章ID
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 接口请求数据类型
export interface PagePathToIDRequest {
    slug: string // 别名
}

// 通过自定义页面的路径获取文章ID
export function pagePathToIDAPI(requestData: PagePathToIDRequest): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/post/page-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
