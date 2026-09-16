/*
 * FilePath    : blog-client\src\api\setting\updatePayConfig.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新支付配置
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { GetPayConfigResponse } from "./getPayConfig" // 复用类型

export type UpdatePayConfigRequest = GetPayConfigResponse

// 更新支付配置
export function updatePayConfigAPI(requestData: UpdatePayConfigRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/setting/update-pay-config"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
