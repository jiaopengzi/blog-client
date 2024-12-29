/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-29 17:10:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-29 17:12:13
 * @FilePath     : \blog-client\src\api\upload\getFileCountGroupByFiletype.ts
 * @Description  : 文件统计
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
