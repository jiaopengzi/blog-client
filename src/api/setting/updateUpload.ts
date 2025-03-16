/**
 * @FilePath     : \blog-client\src\api\setting\updateUpload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新上传信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { GetUploadResponse } from "./getUpload" // 复用类型

export type UpdateUploadRequest = GetUploadResponse

// 更新上传信息
export function updateUploadAPI(requestData: UpdateUploadRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/setting/update-upload"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
