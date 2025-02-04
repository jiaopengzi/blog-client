/**
 * @Author       : jiaopengzi
 * @Date         : 2025-02-04 16:51:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-04 16:59:31
 * @FilePath     : \blog-client\src\api\setting\updateUpload.ts
 * @Description  : 更新上传信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { GetUploadResponse } from "./getUpload" // 复用类型

export type UpdateUploadRequest = GetUploadResponse

// 更新上传信息
export function updateUploadAPI(requestData: UpdateUploadRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/option/update-upload"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
