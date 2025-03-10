/**
 * @FilePath     : \blog-client\src\api\upload\getFileCountGroupByFiletype.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 文件统计
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 文件统计
export interface FileCountGroupByFiletype {
    file_type: string // 文件类型
    file_extension: string // 文件扩展名
    file_count: number // 文件数量
}

// 获取文件信息 api 函数
export function getFileCountGroupByFiletypeAPI(): ResPromise<Res<FileCountGroupByFiletype[]>> {
    const urlStr = routerGroup + "/upload/count-group-by-type"
    return request({
        url: urlStr,
        method: "get",
    })
}
