/*
 * FilePath    : blog-client\src\api\setting\updateAPPOption.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新网站配置
 */

import { OptionType } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdateAPPOption {
    key: string
    value: string
    type: OptionType
}

export interface UpdateAPPOptionRequest {
    options: UpdateAPPOption[]
}

// 更新网站配置
export function updateAPPOptionAPI(requestData: UpdateAPPOptionRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/setting/update-app-option"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
