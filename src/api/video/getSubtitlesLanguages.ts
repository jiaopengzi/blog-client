/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-17 10:43:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:15:03
 * @FilePath     : \blog-client\src\api\video\getSubtitlesLanguages.ts
 * @Description  : 获取视频字幕语言列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import type { AxiosPromise } from "axios"
import { routerGroup } from "@/api/routerGroup"
import { type Res } from "@/api/responseCode"

export type SubtitlesLanguagesResData = string[] | null

export function getSubtitlesLanguagesAPI(
    videoHashId: string,
): AxiosPromise<Res<SubtitlesLanguagesResData>> {
    return request({
        url: `${routerGroup}/subtitles/languages/${videoHashId}`,
        method: "get",
    })
}
