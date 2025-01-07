/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:52:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:54:30
 * @FilePath     : \blog-client\src\api\user\editUserInfoByAdmin.ts
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type PgSqlDateTime } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface EditUserInfoByAdminRequest {
    edit_user_id: string // 用户id
    user_name: string // 用户名
    email: string // 邮箱
    disable_expires_at: PgSqlDateTime // 禁用到期时间
    password: string // 密码
    role_name: string // 角色
    nick_name: string // 昵称
    sex: string // 性别
    description: string // 描述
}

export function editUserInfoByAdminAPI(
    requestData: EditUserInfoByAdminRequest,
): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/edit"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
