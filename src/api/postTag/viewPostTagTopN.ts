/**
 * @FilePath     : \blog-client\src\api\postTag\viewPostTagTopN.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 文章标签 top n
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostTag } from "./view"

// 查看文章标签 top n
export function viewPostTagTopNAPI(): ResPromise<Res<PostTag[]>> {
    const urlStr = routerGroup + "/post-tag/view-top-n"
    return request({
        url: urlStr,
        method: "get",
    })
}
