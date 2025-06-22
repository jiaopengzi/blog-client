/**
 * @FilePath     : \blog-client\src\api\user\deleteUser.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 删除用户
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteUserRequest {
    id_list: string[] // 用户 id 列表
}

// 注册
export function deleteUserAPI(requestData: DeleteUserRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/user/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
