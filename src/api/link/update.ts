/*
 * FilePath    : blog-client\src\api\link\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新链接
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { UpdateLinkRequest } from "./common"

// 更新链接
export function updateLinkAPI(requestData: UpdateLinkRequest): ResPromise<Res<StreamIdsStatusResWithId>> {
    const urlStr = routerGroup + "/link/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
