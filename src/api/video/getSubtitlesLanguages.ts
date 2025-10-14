/**
 * @FilePath     : \blog-client\src\api\video\getSubtitlesLanguages.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取视频字幕语言列表
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export type SubtitlesLanguagesResData = string[] | null

export function getSubtitlesLanguagesAPI(fileIdHash: string): ResPromise<Res<SubtitlesLanguagesResData>> {
    return request({
        url: `${routerGroup}/subtitles/languages/${fileIdHash}`,
        method: "get",
    })
}
