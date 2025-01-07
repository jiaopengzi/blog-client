/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-23 15:25:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:52:12
 * @FilePath     : \blog-client\src\api\postTag\viewPostTagTopNAdmin.ts
 * @Description  : 文章标签 top n (管理员)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostTag } from "./view"

// 查看文章标签 top n
export function viewPostTagTopNAdminAPI(): ResPromise<Res<PostTag[]>> {
    const urlStr = routerGroup + "/post-tag/view-top-n-admin"
    return request({
        url: urlStr,
        method: "get",
    })
}
