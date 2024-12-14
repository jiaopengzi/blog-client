/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-14 17:04:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-31 16:59:17
 * @FilePath     : \blog-client\src\api\user\CheckUserName.ts
 * @Description  : 用户查重
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface CheckUserNameRequest {
    user_name: string
}

// 检测用户名是否存在
export function checkUserNameAPI(requestData: CheckUserNameRequest): AxiosPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/check-username"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
