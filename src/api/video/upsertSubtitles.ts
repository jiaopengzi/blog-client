/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-05 17:18:25
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-06 10:39:28
 * @FilePath     : \blog-client\src\api\video\upsertSubtitles.ts
 * @Description  : 视频字幕上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

//  插入或更新字幕 请求参数
export interface UpsertSubtitlesRequest {
    file_id: string // 视频文件id
    language: string // 字幕语言
    label: string // 字幕标签
    subtitles: string // 字幕内容
}

// 更新字幕
export function upsertSubtitlesAPI(requestData: UpsertSubtitlesRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/subtitles/upsert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
