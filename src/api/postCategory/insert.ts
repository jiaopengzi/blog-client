/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 14:41:44
 * @FilePath     : \blog-client\src\api\category\insert.ts
 * @Description  : 插入文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface InsertPostCategoryRequest {
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
    parent?: string // 父级分类
}

// 插入文章标签
export function insertPostCategoryAPI(requestData: InsertPostCategoryRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post-category/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
