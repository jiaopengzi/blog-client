/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-17 10:43:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:56:16
 * @FilePath     : \blog-client\src\api\video\getSubtitlesLanguages.ts
 * @Description  : 获取视频字幕语言列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export type SubtitlesLanguagesResData = string[] | null

export function getSubtitlesLanguagesAPI(videoHashId: string): ResPromise<Res<SubtitlesLanguagesResData>> {
    return request({
        url: `${routerGroup}/subtitles/languages/${videoHashId}`,
        method: "get",
    })
}
