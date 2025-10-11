/**
 * @FilePath     : \blog-client\src\api\upload\updateFile.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新文件
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdateFileRequest {
    file_id: string // 文件 ID
    file_name_display: string // 文件名
    description: string // 描述
    is_free: boolean // 是否免费
    is_video: boolean // 是否为视频
}

export function updateFileAPI(req: UpdateFileRequest): ResPromise<Res<StreamsStatusRes>> {
    return request({
        url: routerGroup + "/upload/update",
        method: "post",
        data: req,
    })
}
