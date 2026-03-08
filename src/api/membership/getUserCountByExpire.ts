/*
 * FilePath    : blog-client\src\api\membership\getUserCountByExpire.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 按照是否过期统计会员用户数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface MembershipUserCountByExpire {
    is_expired: boolean // 是否已过期
    count: number // 数量
}

/**
 * getMembershipUserCountByExpireAPI 获取会员用户按是否过期统计数据。
 */
export function getMembershipUserCountByExpireAPI(): ResPromise<Res<MembershipUserCountByExpire[]>> {
    const urlStr = routerGroup + "/membership/user-count-by-expire"
    return request({
        url: urlStr,
        method: "get",
    })
}
