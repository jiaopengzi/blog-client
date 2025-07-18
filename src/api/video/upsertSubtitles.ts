/**
 * @FilePath     : \blog-client\src\api\video\upsertSubtitles.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 视频字幕上传
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

//  插入或更新字幕 请求参数
export interface UpsertSubtitlesRequest {
    file_id: string // 视频文件id
    language: string // 字幕语言
    label: string // 字幕标签
    subtitles: string // 字幕内容
}

// 更新字幕
export function upsertSubtitlesAPI(requestData: UpsertSubtitlesRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/subtitles/upsert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
