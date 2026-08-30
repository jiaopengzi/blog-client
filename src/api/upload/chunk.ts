/*
 * FilePath    : blog-client-nuxt\src\api\upload\chunk.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 分片上传
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 分片元信息, 不包含文件 ID
export interface ChunkMetadataWithoutFileId {
    hash_key: string // 哈希值
    hash_algorithm: string // 哈希算法
    part_numbers: number // 分片数量
    part_index: number // 分片序号
    start: number // 分片开始位置
    end: number // 分片结束位置
}

// 分片元信息, 包含文件 ID 和文件子目录
export interface ChunkMetadata extends ChunkMetadataWithoutFileId {
    File_id: string // 文件 ID, 后端生成
    sub_dir: string // 文件路径, 后端生成
}

// 普通文件上传分片
export function uploadChunkAPI(formData: FormData, chunkMetadata: ChunkMetadata): ResPromise<Res<string>> {
    const metadataJson = JSON.stringify(chunkMetadata)

    formData.append("metadata", metadataJson)

    return request({
        url: routerGroup + "/upload/chunk",
        method: "post",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data", // 上传文件时指定类型
        },
    })
}

// 头像上传分片
export function uploadChunkAvatarAPI(formData: FormData, chunkMetadata: ChunkMetadata): ResPromise<Res<string>> {
    const metadataJson = JSON.stringify(chunkMetadata)

    formData.append("metadata", metadataJson)

    return request({
        url: routerGroup + "/upload/avatar/chunk",
        method: "post",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data", // 上传文件时指定类型
        },
    })
}

// 编辑器文件上传分片
export function uploadChunkEditorAPI(formData: FormData, chunkMetadata: ChunkMetadata): ResPromise<Res<string>> {
    const metadataJson = JSON.stringify(chunkMetadata)

    formData.append("metadata", metadataJson)

    return request({
        url: routerGroup + "/upload/editor/chunk",
        method: "post",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data", // 上传文件时指定类型
        },
    })
}
