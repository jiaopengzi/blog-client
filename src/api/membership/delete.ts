/*
 * FilePath    : blog-client\src\api\membership\delete.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除会员
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteMembershipRequest {
    id_list: string[]
}

// 删除会员
export function deleteMembershipAPI(requestData: DeleteMembershipRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/membership/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
