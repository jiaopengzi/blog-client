/*
 * FilePath    : blog-client\src\api\membership\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新会员
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { UpdateMembershipRequest } from "./common"

// 更新会员
export function updateMembershipAPI(requestData: UpdateMembershipRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/membership/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
