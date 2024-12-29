/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-26 15:02:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:08:23
 * @FilePath     : \blog-client\src\api\user\getUserCountGroupByRole.ts
 * @Description  : 用户统计
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
