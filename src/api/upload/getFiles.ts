/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-27 16:38:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:03:23
 * @FilePath     : \blog-client\src\api\upload\getFiles.ts
 * @Description  : 获取文件列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import { type Res } from "@/api/responseCode"
import type { AxiosPromise } from "axios"
import type { DataWithImg, Pagination, PaginationRequest } from "@/components/common"

export interface GetMediaFilesRequest extends PaginationRequest {
    file_type?: string // 角色
}

// 每行媒体文件信息
export interface MediaFile extends DataWithImg {
    id: number // 媒体文件 ID
    created_at: string // 注册时间
    file_name: string // 文件名 id 和 hash组成
    file_name_display: string // 文件显示名
    file_type: string // 文件类型
    is_server_process: boolean // 是否服务器处理
    is_ffmpeg_process: boolean // 是否ffmpeg处理
    is_generate_hls: boolean // 是否生成HLS
    author: string // 作者
    url_belong: string // 所属网址
    path: string // 路径
    description: string // 描述
    slug: string // 别名
    thumbnail: string // 缩略图
    is_free: boolean // 是否免费
    is_encrypt: boolean // 是否加密
    is_delete_original: boolean // 是否删除原文件
    video_quality_name: string // 视频质量
    subtitles_language_list: string[] // 字幕语言列表
}

// 获取媒体文件信息 api 函数
export async function getMediaFilesAPI(
    requestData: GetMediaFilesRequest,
): AxiosPromise<Res<Pagination<MediaFile>>> {
    const urlStr = routerGroup + "/upload/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
