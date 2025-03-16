/**
 * @FilePath     : \blog-client\src\api\setting\hasAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 是否已经设置了管理员
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 检测验证码是否正确
export function hasAdminAPI(): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/setting/has-admin"
    return request({
        url: urlStr,
        method: "get",
    })
}
