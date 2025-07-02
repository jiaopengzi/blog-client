/*
 * FilePath    : blog-client\src\api\setting\getPayConfigStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取支付配置状态
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetPayConfigStatusResponse {
    wechat_pay: boolean // 微信支付配置状态
    alipay: boolean // 支付宝支付配置状态
}

// 获取支付配置状态
export function getPayConfigStatusAPI(): ResPromise<Res<GetPayConfigStatusResponse>> {
    const urlStr = routerGroup + "/setting/get-pay-config-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
