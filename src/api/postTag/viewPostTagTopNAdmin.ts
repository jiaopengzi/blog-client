/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-23 15:25:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-23 15:27:43
 * @FilePath     : \blog-client\src\api\postTag\viewPostTagTopNAdmin.ts
 * @Description  : 文章标签 top n (管理员)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PostTag } from "./view"

// 查看文章标签 top n
export function viewPostTagTopNAdminAPI(): AxiosPromise<Res<PostTag[]>> {
    const urlStr = routerGroup + "/post-tag/view-top-n-admin"
    return request({
        url: urlStr,
        method: "get",
    })
}
