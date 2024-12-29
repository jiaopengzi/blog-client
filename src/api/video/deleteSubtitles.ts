/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-06 09:33:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-06 10:39:43
 * @FilePath     : \blog-client\src\api\video\deleteSubtitles.ts
 * @Description  : 删除字幕
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

//  删除字幕 请求参数
export interface DeleteSubtitlesRequest {
    file_id: string // 视频文件id
    language: string // 字幕语言
}

// 更新字幕
export function deleteSubtitlesAPI(requestData: DeleteSubtitlesRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/subtitles/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
