/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-17 15:20:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:14:15
 * @FilePath     : \blog-client\src\api\video\getSubtitles.ts
 * @Description  : 获取字幕
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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

// 根据 videoHashId 和 subtitlesLanguage 获取字幕
export function getSubtitlesAPI(videoHashId: string): ResPromise<Res<Subtitles>> {
    return request({
        url: `${routerGroup}/subtitles/webvtt/${videoHashId}`,
        method: "get",
    })
}
