/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-18 12:00:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:50:44
 * @FilePath     : \blog-client\src\api\post\viewRecommendedPost.ts
 * @Description  : 推荐文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
