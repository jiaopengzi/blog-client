/*
 * FilePath    : blog-client\src\api\accountKey\deleteItem.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除账号密钥子表
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteAccountKeyItemRequest {
    id_list: string[]
}

export type DeleteAccountKeyItemRes = StreamsStatusRes

// 删除账号密钥子表
export function deleteAccountKeyItemAPI(requestData: DeleteAccountKeyItemRequest): ResPromise<Res<DeleteAccountKeyItemRes>> {
    const urlStr = routerGroup + "/account-key/item/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
