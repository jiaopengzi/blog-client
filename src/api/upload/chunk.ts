/**
 * @FilePath     : \blog-client\src\api\upload\chunk.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 分片上传
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 定义分片元信息对象,不包含文件ID
export interface ChunkMetadataWithoutFileId {
    hash_key: string //哈希值
    hash_algorithm: string //哈希算法
    part_numbers: number //分片数量
    part_index: number //分片序号
    start: number //分片开始位置
    end: number //分片结束位置
}

// 定义分片元信息对象 包含文件ID 和 文件子目录
export interface ChunkMetadata extends ChunkMetadataWithoutFileId {
    File_id: string //文件ID 后端生成
    sub_dir: string //文件路径 后端生成
}

// 普通文件上传分片
export function uploadChunkAPI(
    formData: FormData, // FormData 对象
    chunkMetadata: ChunkMetadata, // 元信息对象
): ResPromise<Res<string>> {
    // 将元信息对象转换为 JSON 字符串
    const metadataJson = JSON.stringify(chunkMetadata)

    // 添加元信息
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
export function uploadChunkAvatarAPI(
    formData: FormData, // FormData 对象
    chunkMetadata: ChunkMetadata, // 元信息对象
): ResPromise<Res<string>> {
    // 将元信息对象转换为 JSON 字符串
    const metadataJson = JSON.stringify(chunkMetadata)

    // 添加元信息
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
export function uploadChunkEditorAPI(
    formData: FormData, // FormData 对象
    chunkMetadata: ChunkMetadata, // 元信息对象
): ResPromise<Res<string>> {
    // 将元信息对象转换为 JSON 字符串
    const metadataJson = JSON.stringify(chunkMetadata)

    // 添加元信息
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
