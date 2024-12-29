/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-18 11:57:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:50:36
 * @FilePath     : \blog-client\src\api\post\viewHotPost.ts
 * @Description  : 热门文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
