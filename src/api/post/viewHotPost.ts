/**
 * @FilePath     : \blog-client\src\api\post\viewHotPost.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 热门文章
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostResCommon } from "./common"

// 查看文章
export function viewHotPostAPI(): ResPromise<Res<PostResCommon[]>> {
    const urlStr = routerGroup + "/post/view-hot"
    return request({
        url: urlStr,
        method: "get",
    })
}
