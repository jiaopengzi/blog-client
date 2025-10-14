/**
 * @FilePath     : \blog-client\src\api\video\getSubtitles.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取字幕
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export type Subtitles = Record<
    string,
    {
        subtitles: string
        label: string
    }
>

// 根据 fileIdHash 和 subtitlesLanguage 获取字幕
export function getSubtitlesAPI(fileIdHash: string): ResPromise<Res<Subtitles>> {
    return request({
        url: `${routerGroup}/subtitles/webvtt/${fileIdHash}`,
        method: "get",
    })
}
