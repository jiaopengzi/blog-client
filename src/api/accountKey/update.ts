/*
 * FilePath    : blog-client\src\api\accountKey\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新账号密钥
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { UpdateAccountKeyRequest } from "./common"

// 更新响应
export interface UpdateAccountKeyResData extends StreamsStatusRes {
    updated_at: string
}

// 更新账号密钥
export function updateAccountKeyAPI(requestData: UpdateAccountKeyRequest): ResPromise<Res<UpdateAccountKeyResData>> {
    const urlStr = routerGroup + "/account-key/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
