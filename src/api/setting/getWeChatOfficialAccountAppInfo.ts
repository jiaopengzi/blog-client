/*
 * FilePath    : blog-client\src\api\setting\getWeChatOfficialAccountAppInfo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取微信公众号应用信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 微信公众号应用信息
export interface WeChatOfficialAccountAppInfoResponse {
    wechat_official_account_app_id: string // 微信公众号 AppID
    wechat_official_account_app_secret: string // 微信公众号 AppSecret
}

// 获取微信公众号应用信息
export function getWeChatOfficialAccountAppInfoAPI(): ResPromise<Res<WeChatOfficialAccountAppInfoResponse>> {
    const urlStr = routerGroup + "/setting/get-wechat-official-account-app-info"
    return request({
        url: urlStr,
        method: "get",
    })
}
