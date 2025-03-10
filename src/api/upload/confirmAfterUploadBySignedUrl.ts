/**
 * @FilePath     : \blog-client\src\api\upload\confirmAfterUploadBySignedUrl.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 使用 签名URL 上传文件 后确认
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// ConfirmAfterUploadBySignedUrlRequest
// 使用 签名URL 上传文件 后确认请求
export interface ConfirmAfterUploadBySignedUrlRequest {
    file_id: string // 文件ID
}

// 普通文件使用 签名URL 上传文件 后确认
export function confirmAfterUploadBySignedUrlAPI(requestData: ConfirmAfterUploadBySignedUrlRequest): ResPromise<Res<void>> {
    return request({
        url: routerGroup + "/upload/confirm-after-upload-by-signed-url",
        method: "post",
        data: requestData,
    })
}

// 头像使用 签名URL 上传文件 后确认
export function confirmAfterUploadBySignedUrlAvatarAPI(requestData: ConfirmAfterUploadBySignedUrlRequest): ResPromise<Res<void>> {
    return request({
        url: routerGroup + "/upload/avatar/confirm-after-upload-by-signed-url",
        method: "post",
        data: requestData,
    })
}

// 编辑器文件上传使用 签名URL 上传文件 后确认
export function confirmAfterUploadBySignedUrlEditorAPI(requestData: ConfirmAfterUploadBySignedUrlRequest): ResPromise<Res<void>> {
    return request({
        url: routerGroup + "/upload/editor/confirm-after-upload-by-signed-url",
        method: "post",
        data: requestData,
    })
}
