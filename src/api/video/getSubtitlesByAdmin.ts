/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-06 09:35:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:14:35
 * @FilePath     : \blog-client\src\api\video\getSubtitlesByAdmin.ts
 * @Description  : 获取字幕(管理员)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface SubtitlesByAdminResData {
    subtitles: string
    label: string
}

// 根据 videoHashId 和 subtitlesLanguage 获取字幕(用于管理员)
export function getSubtitlesByAdminAPI(
    videoHashId: string,
    subtitlesLanguage: string,
): ResPromise<Res<SubtitlesByAdminResData>> {
    return request({
        url: `${routerGroup}/subtitles/${videoHashId}/${subtitlesLanguage}`,
        method: "get",
    })
}
