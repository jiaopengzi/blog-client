/**
 * @FilePath     : \blog-client\src\api\upload\deleteFile.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除文件
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteFileRequest {
    file_id_list: string[] // 文件 id 列表
}

// 删除文件
export function deleteFileAPI(requestData: DeleteFileRequest): ResPromise<Res<StreamIdsStatusResWithId >> {
    const urlStr = routerGroup + "/upload/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
