/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:38:20
 * @FilePath     : \blog-client\src\api\postCategory\update.ts
 * @Description  : 更新文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface UpdatePostCategoryRequest {
    id: string // 分类id
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
    parent?: string // 父级分类
}

// 更新文章分类
export function updatePostCategoryAPI(requestData: UpdatePostCategoryRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post-category/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
