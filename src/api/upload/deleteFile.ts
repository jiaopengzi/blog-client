/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-30 17:23:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-30 17:24:34
 * @FilePath     : \blog-client\src\api\upload\deleteFile.ts
 * @Description  : 删除文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteFileRequest {
    file_id_list: string[] // 文件 id 列表
}

// 删除文件
export function deleteFileAPI(requestData: DeleteFileRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/upload/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
