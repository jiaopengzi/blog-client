/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 15:59:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:36:49
 * @FilePath     : \blog-client\src\api\postTag\delete.ts
 * @Description  : 删除文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface DeletePostTagRequest {
    id_list: string[] // tag名称
}

// 删除文章标签
export function deletePostTagAPI(requestData: DeletePostTagRequest): AxiosPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
