/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-18 11:57:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-18 12:03:14
 * @FilePath     : \blog-client\src\api\post\viewHotPost.ts
 * @Description  : 热门文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PostResCommon } from "./common"

// 查看文章
export function viewHotPostAPI(): AxiosPromise<Res<PostResCommon[]>> {
    const urlStr = routerGroup + "/post/view-hot"
    return request({
        url: urlStr,
        method: "get",
    })
}
