/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-27 16:38:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 11:19:18
 * @FilePath     : \blog-client\src\api\upload\getFiles.ts
 * @Description  : 获取文件列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import type { DataWithImg, Pagination, PaginationRequest } from "@/components/common"
import { ResponseCode } from "@/api/responseCode"
import { ImgFit } from "@/components/common"
import { formatTime } from "@/utils/dateTime"
import { IconKeys } from "@/components/common/icons"

export interface GetMediaFilesRequest extends PaginationRequest {
    file_type?: string // 角色
}

// 获取媒体文件信息响应类型
export interface GetMediaFilesResponse {
    code: number
    msg: string
    data: Pagination<MediaFile>
}

// 获取媒体文件信息 api 函数
export async function getMediaFilesAPI(
    requestData: GetMediaFilesRequest,
): AxiosPromise<GetMediaFilesResponse> {
    const urlStr = routerGroup + "/upload/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
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

// /**
//  * @description: 格式化媒体文件信息
//  * @param MediaFile 后端媒体文件信息
//  * @param width 图片宽度
//  * @param height 图片高度
//  * @param imgFit 图片填充方式
//  * @return  {MediaFile} 格式化后的媒体文件信息
//  */
// export function formatMediaFile(
//     { thumbnail, created_at, ...MediaFile }: any,
//     width: number,
//     height: number,
//     imgFit: ImgFit,
//     svgFontSize: number,
// ): MediaFile {
//     const formattedMediaFile: MediaFile = {
//         ...MediaFile,
//         created_at: formatTime(created_at), // 使用 formatTime 进行格式化
//     }

//     // 如果 thumbnail 不为空，添加 img 属性
//     if (thumbnail) {
//         formattedMediaFile.img = {
//             url: thumbnail,
//             width: width,
//             height: height,
//             imgFit: imgFit,
//         }
//     }

//     // 如果 thumbnail 为空，添加 icon 属性
//     if (!thumbnail && MediaFile.file_type === "application/zip") {
//         formattedMediaFile.img = {
//             url: "",
//             svgFontSize: svgFontSize,
//             iconKeyName: IconKeys.Zip,
//         }
//     }

//     return formattedMediaFile
// }

// // 默认的 MediaFileInfo 空对象
// export function emptyMediaFiles(): Pagination<MediaFile> {
//     return {
//         total: 0,
//         current_page: 1,
//         page_size: 10,
//         page_count: 1,
//         page_sizes: [10],
//         records: [],
//     }
// }
