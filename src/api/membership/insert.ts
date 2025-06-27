/*
 * FilePath    : blog-client\src\api\membership\insert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 插入会员
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { InsertMembershipRequest, MembershipStatus } from "./common"

// 插入响应
export interface InsertMembershipResData {
    id: string
    created_at: string
    updated_at: string
    status: MembershipStatus
}

// 插入
export function insertMembershipAPI(requestData: InsertMembershipRequest): ResPromise<Res<InsertMembershipResData>> {
    const urlStr = routerGroup + "/membership/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
