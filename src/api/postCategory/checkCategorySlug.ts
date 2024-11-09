/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 14:37:22
 * @FilePath     : \blog-client\src\api\category\checkCategorySlug.ts
 * @Description  : 检查 分类 别名是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface CheckCategorySlugRequest {
    slug: string // category 别名
}

// 检查 category 名称是否存在
export function checkCategorySlugAPI(requestData: CheckCategorySlugRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post-category/check-category-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
