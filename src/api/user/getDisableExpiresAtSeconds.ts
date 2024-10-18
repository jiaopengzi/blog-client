/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-21 16:55:27
 * @FilePath     : \blog-client\src\api\user\getDisableExpiresAtSeconds.ts
 * @Description  : 获取用户禁用剩余时间 秒, 0表示未禁用
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface GetDisableExpiresAtSecondsRequest {
    login_name: string
}

// 检测用户名是否存在
export function getDisableExpiresAtSecondsAPI(
    requestData: GetDisableExpiresAtSecondsRequest,
): AxiosPromise<Res> {
    const urlStr = routerGroup + "/user/get-disable-expires-at-seconds"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
