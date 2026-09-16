/*
 * FilePath    : blog-client\src\api\billingCenter\notifyThreshold.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心设置通知阈值
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 设置通知阈值请求参数
export interface BillingCenterNotifyThresholdRequest {
    notify_threshold: string // 通知阈值(分)
    notify_enabled: boolean // 通知开关
}

// 设置通知阈值
export function billingCenterNotifyThresholdAPI(requestData: BillingCenterNotifyThresholdRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/billing-center/notify-threshold"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
