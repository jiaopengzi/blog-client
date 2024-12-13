/**
 * @Author       : jiaopengzi
 * @Date         : 2024-07-24 21:48:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 18:19:41
 * @FilePath     : \blog-client\src\api\upload\confirmBeforeUpload.ts
 * @Description  : 上传文件前确认
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

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
export function confirmBeforeUploadAPI(requestData: ConfirmBeforeUploadRequest): AxiosPromise<Res> {
    return request({
        url: routerGroup + "/upload/confirm-before-upload",
        method: "post",
        data: requestData,
    })
}

// 头像上传前确认
export function confirmBeforeUploadAvatarAPI(
    requestData: ConfirmBeforeUploadRequest,
): AxiosPromise<Res> {
    return request({
        url: routerGroup + "/upload/avatar/confirm-before-upload",
        method: "post",
        data: requestData,
    })
}

// 编辑器文件上传前确认
export function confirmBeforeUploadEditorAPI(
    requestData: ConfirmBeforeUploadRequest,
): AxiosPromise<Res> {
    return request({
        url: routerGroup + "/upload/editor/confirm-before-upload",
        method: "post",
        data: requestData,
    })
}
