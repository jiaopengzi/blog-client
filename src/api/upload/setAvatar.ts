/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 18:19:52
 * @FilePath     : \blog-client\src\api\upload\setAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface SetAvatarRequest {
    user_id: string // 用户ID
    avatar_url: string // 头像URL
}

export function setAvatarAPI(req: SetAvatarRequest): ResPromise<Res<unknown>> {
    return request({
        url: routerGroup + "/upload/avatar/set",
        method: "post",
        data: req,
    })
}
