/**
 * @FilePath     : \blog-client\src\api\setting\getUpload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取上传配置
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 允许上传的文件类型
export interface FileAllowed {
    type: string
    extension: string
    max_size: number
    is_server_process: boolean
    is_ffmpeg_process: boolean
}

// 本地上传配置
export interface Local {
    is_enabled: boolean
    is_url_belong: boolean
    path: string
}

// 阿里云OSS配置
export interface OSS {
    is_enabled: boolean
    is_url_belong: boolean
    parallel_num: number
    key_id: string
    key_secret: string
    region: string
    endpoint: string
    bucket_name: string
    domain: string
    endpoint_internal: string
    is_internal: boolean
}

// 腾讯云 COS 配置
export interface COS {
    is_enabled: boolean
    is_url_belong: boolean
    parallel_num: number
    secret_id: string
    secret_key: string
    region: string
    bucket_name: string
    path: string
    domain: string
}

export interface FFmpeg {
    is_generate_hls: boolean // 是否生成 HLS
    is_generate_multi_resolution: boolean // 是否生成多分辨率视频
    is_delete_original: boolean // 是否删除原始视频
}

export interface GetUploadResponse {
    file_allowed: FileAllowed[]
    local: Local
    oss: OSS
    cos: COS
    ffmpeg: FFmpeg
}

// 获取上传配置
export function getUploadAPI(): ResPromise<Res<GetUploadResponse>> {
    const urlStr = routerGroup + "/setting/get-upload"
    return request({
        url: urlStr,
        method: "get",
    })
}
