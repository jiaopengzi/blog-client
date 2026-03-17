/*
 * FilePath    : blog-client\src\api\post\postPathToID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通过文章别名获取文章ID
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 接口请求数据类型
export interface PostPathToIDRequest {
    slug: string // 别名
}

/**
 * 通过文章别名获取文章 ID.
 *
 * @param requestData - 包含文章别名的请求参数.
 * @returns 返回文章 ID 查询请求结果.
 */
export function postPathToIDAPI(requestData: PostPathToIDRequest): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/post/post-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
