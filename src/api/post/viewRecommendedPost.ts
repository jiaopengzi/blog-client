/**
 * @FilePath     : \blog-client\src\api\post\viewRecommendedPost.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 推荐文章
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostResCommon } from "./common"

// 查看文章
export function viewRecommendedPostAPI(): ResPromise<Res<PostResCommon[]>> {
    const urlStr = routerGroup + "/post/view-recommended"
    return request({
        url: urlStr,
        method: "get",
    })
}
