/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-07 14:38:43
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 18:19:57
 * @FilePath     : \blog-client\src\api\upload\updateFile.ts
 * @Description  : 更新文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdateFileRequest {
    file_id: string // 文件 ID
    file_name_display: string // 文件名
    description: string // 描述
    slug: string // 别名
    is_free: boolean // 是否免费
    is_video: boolean // 是否为视频
}

export function updateFileAPI(req: UpdateFileRequest): ResPromise<Res<unknown>> {
    return request({
        url: routerGroup + "/upload/update",
        method: "post",
        data: req,
    })
}
