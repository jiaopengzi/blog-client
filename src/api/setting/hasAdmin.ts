/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-14 11:45:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-14 11:46:09
 * @FilePath     : \blog-client\src\api\setting\hasAdmin.ts
 * @Description  : 是否已经设置了管理员
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 检测验证码是否正确
export function hasAdminAPI(): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/option/has-admin"
    return request({
        url: urlStr,
        method: "get",
    })
}
