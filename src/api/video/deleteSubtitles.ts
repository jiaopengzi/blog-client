/**
 * @FilePath     : \blog-client\src\api\video\deleteSubtitles.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除字幕
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

//  删除字幕 请求参数
export interface DeleteSubtitlesRequest {
    file_id: string // 视频文件id
    language: string // 字幕语言
}

// 更新字幕
export function deleteSubtitlesAPI(requestData: DeleteSubtitlesRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/subtitles/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
