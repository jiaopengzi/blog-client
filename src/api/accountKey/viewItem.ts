/*
 * FilePath    : blog-client\src\api\accountKey\viewItem.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看账号密钥子表
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { AccountKeyItemRes } from "./common"

// 查看账号密钥子表请求参数
export type ViewAccountKeyItemRequest = PaginationRequest

// 查看账号密钥子表
export function viewAccountKeyItemAPI(requestData: ViewAccountKeyItemRequest): ResPromise<Res<Pagination<AccountKeyItemRes>>> {
    const urlStr = routerGroup + "/account-key/item/get-paginate-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
