/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-21 20:26:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-23 16:16:50
 * @FilePath     : \blog-client\src\api\user\bindEmail.ts
 * @Description  : 绑定邮箱
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// import request from '../request'
import request from "@/api/request"
import { routerGroup } from "@/api//routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface BindEmailRequest {
    email: string
    captcha: string
}

// 注册
export function bindEmailAPI(requestData: BindEmailRequest): AxiosPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/bind-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
