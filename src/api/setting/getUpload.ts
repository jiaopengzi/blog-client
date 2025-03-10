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

export interface GetUploadResponse {
    file_allowed: FileAllowed[]
    local: Local
    oss: OSS
}

// 获取上传配置
export function getUploadAPI(): ResPromise<Res<GetUploadResponse>> {
    const urlStr = routerGroup + "/option/get-upload"
    return request({
        url: urlStr,
        method: "get",
    })
}
