/*
 * FilePath    : blog-client\src\api\link\view.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看链接
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { LinkRes } from "./common"

// 查看链接请求参数
export type ViewLinkRequest = PaginationRequest

// 查看链接
export function viewLinkAPI(requestData: ViewLinkRequest): ResPromise<Res<Pagination<LinkRes>>> {
    const urlStr = routerGroup + "/link/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 查看链接(管理员)
export function viewLinkAdminAPI(requestData: ViewLinkRequest): ResPromise<Res<Pagination<LinkRes>>> {
    const urlStr = routerGroup + "/link/view-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
