/*
 * FilePath    : blog-client\src\api\membership\getCountByStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 按照会员状态统计会员数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { MembershipStatus } from "./common"

export interface MembershipCountByStatus {
    status: MembershipStatus // 状态
    count: number // 数量
}

export function getMembershipCountByStatusAPI(): ResPromise<Res<MembershipCountByStatus[]>> {
    const urlStr = routerGroup + "/membership/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
