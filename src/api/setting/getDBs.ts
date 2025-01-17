/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-16 11:30:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-16 11:39:01
 * @FilePath     : \blog-client\src\api\setting\getDBs.ts
 * @Description  : 获取数据库信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { SetupRequest } from "./setup" // 请求和响应的类型相同

type GetDBsResponse = SetupRequest

// 获取数据库信息
export function getDBsAPI(): ResPromise<Res<GetDBsResponse>> {
    const urlStr = routerGroup + "/option/get-dbs"
    return request({
        url: urlStr,
        method: "get",
    })
}
