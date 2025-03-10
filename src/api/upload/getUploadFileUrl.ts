/**
 * @FilePath     : \blog-client\src\api\upload\getUploadFileUrl.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取上传文件的 url
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetUploadFileUrlRequest {
    file_id: string // 文件 id
}

// 获取上传文件的 url
export function getUploadFileUrlAPI(requestData: GetUploadFileUrlRequest): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/upload/get-upload-file-url"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 获取上传头像的 url
export function getUploadFileUrlAvatarAPI(requestData: GetUploadFileUrlRequest): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/upload/avatar/get-upload-file-url"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 编辑器上传文件获取上传文件的 url
export function getUploadFileUrlEditorAPI(requestData: GetUploadFileUrlRequest): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/upload/editor/get-upload-file-url"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
