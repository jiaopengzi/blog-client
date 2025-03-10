/**
 * @FilePath     : \blog-client\src\api\upload\setAvatar.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传头像
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
