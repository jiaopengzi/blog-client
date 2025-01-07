/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 16:52:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-07 16:54:29
 * @FilePath     : \blog-client\src\api\setting\isSetup.ts
 * @Description  : 是否已经设置数据库
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 检测验证码是否正确
export function isSetupAPI(): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/is-setup"
    return request({
        url: urlStr,
        method: "get",
    })
}
