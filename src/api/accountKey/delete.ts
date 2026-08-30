/*
 * FilePath    : blog-client-nuxt\src\api\accountKey\delete.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除账号密钥
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteAccountKeyRequest {
    id_list: string[]
}

// 删除账号密钥响应
export type DeleteAccountKeyRes = StreamsStatusRes

// 删除账号密钥
export function deleteAccountKeyAPI(requestData: DeleteAccountKeyRequest): ResPromise<Res<DeleteAccountKeyRes>> {
    const urlStr = routerGroup + "/account-key/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
