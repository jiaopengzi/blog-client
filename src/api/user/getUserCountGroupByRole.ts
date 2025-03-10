/**
 * @FilePath     : \blog-client\src\api\user\getUserCountGroupByRole.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户统计
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 用户统计
export interface UserCountGroupByRole {
    role_name: string // 角色名称
    user_count: number // 用户数量
}

// 获取用户信息 api 函数
export function getUserCountGroupByRoleAPI(): ResPromise<Res<UserCountGroupByRole[]>> {
    const urlStr = routerGroup + "/user/count-group-by-role"
    return request({
        url: urlStr,
        method: "get",
    })
}
