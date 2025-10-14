/**
 * @FilePath     : \blog-client\src\api\video\getSubtitlesByAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取字幕(管理员)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface SubtitlesByAdminResData {
    subtitles: string
    label: string
}

// 根据 fileIdHash 和 subtitlesLanguage 获取字幕(用于管理员)
export function getSubtitlesByAdminAPI(fileIdHash: string, subtitlesLanguage: string): ResPromise<Res<SubtitlesByAdminResData>> {
    return request({
        url: `${routerGroup}/subtitles/${fileIdHash}/${subtitlesLanguage}`,
        method: "get",
    })
}
