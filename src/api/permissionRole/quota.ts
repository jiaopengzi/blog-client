/**
 * FilePath    : blog-client\src\api\permissionRole\quota.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * @Description  : 权限配额 API
 */

import { request, routerGroup } from "@/api/request"
import { ResponseCode, type Res, type ResPromise } from "@/api/response"
import { displayDurationTime } from "@/utils/dateTime"
import { MessageUtil } from "@/utils/message"

export interface PermissionQuota {
    limit_count: number
    limit_period: number
    used_count: number
    remaining: number
}

export interface GetPermissionQuotaRequest {
    permission_name: string
}

export function getPermissionQuotaAPI(requestData: GetPermissionQuotaRequest): ResPromise<Res<PermissionQuota>> {
    return request({
        url: routerGroup + "/permission/quota",
        method: "post",
        data: requestData,
    })
}

/**
 * 检查上传配额，配额耗尽时弹出警告并返回 true
 * @returns true 表示上传被阻止，false 表示可以继续
 */
export async function checkQuotaBlocked(permissionName: string, label: string): Promise<boolean> {
    try {
        const quotaRes = await getPermissionQuotaAPI({ permission_name: permissionName })
        if (quotaRes.data.code === ResponseCode.GetPermissionQuotaSuccess && quotaRes.data.data.remaining === 0) {
            const { limit_count, limit_period } = quotaRes.data.data
            const periodStr = displayDurationTime(limit_period)
            MessageUtil.warning(`您已达到${label}数量限制（已使用 ${limit_count} 次${limit_period > 0 ? `，${periodStr} 后可再使用。` : ""}）`, 6000)
            return true
        }
    } catch {
        // 配额查询失败，继续上传，由后端校验
    }
    return false
}
