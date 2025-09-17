/*
 * FilePath    : blog-client\src\api\accountKey\getProduct.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取账号密钥产品
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { AccountKeyRes } from "./common"

// 查看账号密钥请求参数
export interface AccountKeyGetProductRequest {
    id: string // 产品ID
}

// 查看账号密钥产品
export function accountKeyGetProductAPI(requestData: AccountKeyGetProductRequest): ResPromise<Res<AccountKeyRes>> {
    const urlStr = routerGroup + "/account-key/get-product"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
