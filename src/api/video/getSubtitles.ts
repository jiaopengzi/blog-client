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

import request from "@/api/request"
import type { AxiosPromise } from "axios"
import { routerGroup } from "@/api/routerGroup"
import { type Res } from "@/api/responseCode"

export type Subtitles = Record<
    string,
    {
        subtitles: string
        label: string
    }
>

// 根据 videoHashId 和 subtitlesLanguage 获取字幕
export function getSubtitlesAPI(videoHashId: string): AxiosPromise<Res<Subtitles>> {
    return request({
        url: `${routerGroup}/subtitles/webvtt/${videoHashId}`,
        method: "get",
    })
}
