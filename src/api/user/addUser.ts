/**
 * @FilePath     : \blog-client\src\api\user\addUser.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 添加用户
 */

import type { StreamIdsStatusResWithId } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface AddUserRequest {
    user_name: string // 用户名
    email: string // 邮箱
    password: string // 密码
    role_name: string // 角色
    is_send_email: boolean // 是否发送邮件
}

// 注册
export function AddUserAPI(requestData: AddUserRequest): ResPromise<Res<StreamIdsStatusResWithId >> {
    const urlStr = routerGroup + "/user/add"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
