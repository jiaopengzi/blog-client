/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-05 17:18:25
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:56:33
 * @FilePath     : \blog-client\src\api\video\upsertSubtitles.ts
 * @Description  : 视频字幕上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
export function upsertSubtitlesAPI(requestData: UpsertSubtitlesRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/subtitles/upsert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
