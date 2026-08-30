/*
 * FilePath    : blog-client-nuxt\src\api\setting\isSetup.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 是否已经设置数据库
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 检测是否已经设置数据库
export function isSetupAPI(): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/is-setup"
    return request({
        url: urlStr,
        method: "get",
    })
}
