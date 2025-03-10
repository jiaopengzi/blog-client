/**
 * @FilePath     : \blog-client\src\api\setting\getDBs.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取数据库信息
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
