/**
 * @FilePath     : \blog-client\src\api\upload\file.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传文件
 */

import { type ReqProgressEvent, request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function uploadFileAPI(formData: FormData, progressCallback: (progressEvent: ReqProgressEvent) => void): ResPromise<Res<unknown>> {
    return request({
        url: routerGroup + "/upload/file",
        method: "post",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data", // 上传文件时指定类型
        },
        onUploadProgress: (progressEvent) => {
            // 检查 total 和 loaded 是否已定义
            if (progressCallback && progressEvent.progress !== undefined) {
                progressCallback(progressEvent)
            }
        },
    })
}
