/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-13 16:35:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:03:05
 * @FilePath     : \blog-client\src\api\user\deleteUser.ts
 * @Description  : 删除用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteUserRequest {
    user_id_list: string[] // 用户 id 列表
}

// 注册
export function deleteUserAPI(requestData: DeleteUserRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
