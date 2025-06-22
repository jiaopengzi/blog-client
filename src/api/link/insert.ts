/*
 * FilePath    : blog-client\src\api\link\insert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 插入链接
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { InsertLinkRequest } from "./common"

// 插入链接
export function insertLinkAPI(requestData: InsertLinkRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/link/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 插入链接
export function insertLinkAdminAPI(requestData: InsertLinkRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/link/insert-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
