/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:31:09
 * @FilePath     : \blog-client\src\api\postCategory\delete.ts
 * @Description  : 删除文章分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface DeletePostCategoryRequest {
    id_list: string[] // 分类ID列表
}

// 删除文章分类
export function deletePostCategoryAPI(
    requestData: DeletePostCategoryRequest,
): AxiosPromise<Res<void>> {
    const urlStr = routerGroup + "/post-category/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
