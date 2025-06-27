/*
 * FilePath    : blog-client\src\api\membership\view.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看会员
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { MembershipRes, MembershipStatus } from "./common"

// 查看会员请求参数
export interface ViewMembershipRequest extends PaginationRequest {
    status?: MembershipStatus // 状态
}

// 查看会员
export function viewMembershipAPI(requestData: ViewMembershipRequest): ResPromise<Res<Pagination<MembershipRes>>> {
    const urlStr = routerGroup + "/membership/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
