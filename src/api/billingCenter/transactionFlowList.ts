/*
 * FilePath    : blog-client\src\api\billingCenter\transactionFlowList.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心交易流水列表
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { Currency, TransactionFlowRes, TransactionType } from "./common"

// 交易流水列表请求参数
export interface TransactionFlowListRequest extends PaginationRequest {
    date_start?: string // 开始日期, 可选
    date_end?: string // 结束日期, 可选
    currency: Currency // 货币类型
    user_id?: string // 用户ID, 可选
    related_id?: string // 关联ID, 可选
    type?: TransactionType // 交易类型, 可选
}

// 交易流水列表
export function billingCenterTransactionFlowListAPI(requestData: TransactionFlowListRequest): ResPromise<Res<Pagination<TransactionFlowRes>>> {
    const urlStr = routerGroup + "/billing-center/transaction-flow-list"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
