/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-03 14:55:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 16:52:59
 * @FilePath     : \blog-client\src\api\post\batchOperationPostStatus.ts
 * @Description  : 批量操作文章状态
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { PostStatusCode } from "./common"

export interface PostStatusOperation {
    id: string // 文章ID
    post_status: PostStatusCode // 文章状态
}

export interface BatchOperationPostStatusRequest {
    operation_list: PostStatusOperation[] // 操作列表
}

// 批量操作文章状态
export function batchOperationPostStatusAPI(
    requestData: BatchOperationPostStatusRequest,
): AxiosPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post/batch-operation-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
