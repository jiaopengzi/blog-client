/*
 * FilePath    : blog-client\src\api\membership\userAdjust.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 管理员人工处理会员
 */

import type { PgSqlDateTime } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { MembershipUserAdjustAction } from "./common"

export interface MembershipUserAdjustRequest {
    id: string
    action: MembershipUserAdjustAction
    duration_seconds?: number
    remark: string
}

export interface MembershipUserAdjustResponse {
    id: string
    expire_time: PgSqlDateTime
    is_expired: boolean
    remark: string
    updated_at: string
}

// membershipUserAdjustAPI 管理员人工处理会员。
export function membershipUserAdjustAPI(requestData: MembershipUserAdjustRequest): ResPromise<Res<MembershipUserAdjustResponse>> {
    const urlStr = routerGroup + "/membership/user-adjust"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
