/*
 * FilePath    : blog-client\src\api\membership\checkMembershipRoleExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查会员角色是否存在，排除指定ID
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckMembershipRoleExcludingIDRequest {
    excluding_id: string // 需要排除的id
    role: string
}

// 检查会员角色是否存在，排除指定ID
export function checkMembershipRoleExcludingIDAPI(requestData: CheckMembershipRoleExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/membership/check-role-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
