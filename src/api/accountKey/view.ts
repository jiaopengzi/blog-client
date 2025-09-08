/*
 * FilePath    : blog-client\src\api\accountKey\view.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看账号密钥
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { AccountKeyRes } from "./common"

// 查看账号密钥请求参数
export type ViewAccountKeyRequest = PaginationRequest

// 查看账号密钥
export function viewAccountKeyAPI(requestData: ViewAccountKeyRequest): ResPromise<Res<Pagination<AccountKeyRes>>> {
    const urlStr = routerGroup + "/account-key/get-paginate-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
