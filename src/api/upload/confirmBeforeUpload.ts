/**
 * @FilePath     : \blog-client\src\api\upload\confirmBeforeUpload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传文件前确认
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import type { UploadFileInfo } from "@/utils/chunkUpload"

// ConfirmBeforeUploadRequest
// 上传前确认请求
export interface ConfirmBeforeUploadRequest {
    file_name: string // 文件名称
    file_size: number // 文件大小
    file_type: string // 文件类型
    file_chunk_size: number // 分片大小
    hash_algorithm: string // 哈希算法
    first_chunk_hash_key: string // 第一个分片的hash值
    part_numbers: number // 分片数量
    is_encrypt: boolean // 是否加密
    is_Free: boolean // 是否免费
}

// 普通文件上传前确认
export function confirmBeforeUploadAPI(requestData: ConfirmBeforeUploadRequest): ResPromise<Res<UploadFileInfo>> {
    return request({
        url: routerGroup + "/upload/confirm-before-upload",
        method: "post",
        data: requestData,
    })
}

// 头像上传前确认
export function confirmBeforeUploadAvatarAPI(requestData: ConfirmBeforeUploadRequest): ResPromise<Res<UploadFileInfo>> {
    return request({
        url: routerGroup + "/upload/avatar/confirm-before-upload",
        method: "post",
        data: requestData,
    })
}

// 编辑器文件上传前确认
export function confirmBeforeUploadEditorAPI(requestData: ConfirmBeforeUploadRequest): ResPromise<Res<UploadFileInfo>> {
    return request({
        url: routerGroup + "/upload/editor/confirm-before-upload",
        method: "post",
        data: requestData,
    })
}
