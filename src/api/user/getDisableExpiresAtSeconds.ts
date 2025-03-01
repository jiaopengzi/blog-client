/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 11:05:35
 * @FilePath     : \blog-client\src\api\user\getDisableExpiresAtSeconds.ts
 * @Description  : 获取用户禁用剩余时间 秒, 0表示未禁用
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetDisableExpiresAtSecondsRequest {
    login_name: string
}

// 检测用户名是否存在
export function getDisableExpiresAtSecondsAPI(requestData: GetDisableExpiresAtSecondsRequest): ResPromise<Res<number>> {
    const urlStr = routerGroup + "/user/get-disable-expires-at-seconds"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
