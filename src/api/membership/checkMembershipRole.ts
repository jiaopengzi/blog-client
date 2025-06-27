/*
 * FilePath    : blog-client\src\api\membership\checkMembershipRole.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员角色查重
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckMembershipRoleRequest {
    role: string
}

// 检查会员角色是否存在
export function checkMembershipRoleAPI(requestData: CheckMembershipRoleRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/membership/check-role"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
