/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 14:38:51
 * @FilePath     : \blog-client\src\api\category\delete.ts
 * @Description  : 删除文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface DeleteCategoryRequest {
    id_list: number[] // category 名称
}

// 删除文章分类
export function deleteCategoryAPI(requestData: DeleteCategoryRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post-category/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
