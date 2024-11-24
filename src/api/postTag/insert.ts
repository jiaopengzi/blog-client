/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 15:53:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-04 15:54:52
 * @FilePath     : \blog-client\src\api\post_tag\insert.ts
 * @Description  : 插入文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface InsertPostTagRequest {
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
}

// 插入文章标签
export function insertPostTagAPI(requestData: InsertPostTagRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post-tag/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
