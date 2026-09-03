/*
 * FilePath    : blog-client-nuxt\src\api\visit\report.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点访问上报(PV/UV)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 站点访问上报请求类型
export interface VisitReportRequest {
    path: string // 页面路由路径
}

// 站点访问上报
export function reportVisitAPI(requestData: VisitReportRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/visit/report"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
