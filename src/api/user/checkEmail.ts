/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-14 18:00:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:48:59
 * @FilePath     : \blog-client\src\api\user\checkEmail.ts
 * @Description  : 邮箱查重
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface CheckEmailRequest {
    email: string
}

// 检测用户名是否存在
export function CheckEmailAPI(requestData: CheckEmailRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/user/check-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
