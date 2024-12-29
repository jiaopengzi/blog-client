/**
 * @Author       : jiaopengzi
 * @Date         : 2024-02-24 11:10:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 13:11:33
 * @FilePath     : \blog-client\src\api\upload\getUploadFileRequirements.ts
 * @Description  : 上传文件的要求
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"
import { HashAlgorithm } from "@/utils/hash"

export interface FileAllowed {
    type: string // 文件类型
    extension: string // 文件扩展名
    max_size: number // 最大上传文件大小Byte
    is_server_process: boolean // 是否服务端处理,否则客户端可直传存储桶
    is_ffmpeg_process: boolean // 是否使用 FFmpeg 处理
}

export interface UploadFileRequirements {
    file_allowed: FileAllowed[] // 允许上传的文件类型及大小
    hash_algorithm: HashAlgorithm // 哈希算法
    chunk_size: number // 分片大小
}

export function getUploadFileRequirementsAPI(): ResPromise<Res<UploadFileRequirements>> {
    return request({
        url: routerGroup + "/upload/file-requirements",
        method: "get",
    })
}
