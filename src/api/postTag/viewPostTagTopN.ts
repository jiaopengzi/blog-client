/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-23 15:25:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-23 15:27:43
 * @FilePath     : \blog-client\src\api\postTag\viewPostTagTopN.ts
 * @Description  : 文章标签 top n
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
