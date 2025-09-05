/*
 * FilePath    : blog-client\src\api\accountKey\insert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥插入
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { InsertAccountKeyRequest } from "./common"

// 插入响应
export interface InsertAccountKeyResData extends StreamsStatusRes {
    id: string
    created_at: string
    updated_at: string
}

// 插入
export function insertAccountKeyAPI(requestData: InsertAccountKeyRequest): ResPromise<Res<InsertAccountKeyResData>> {
    const urlStr = routerGroup + "/account-key/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
