/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:52:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:07:05
 * @FilePath     : \blog-client\src\api\user\editUserInfoByAdmin.ts
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PgSqlDateTime } from "@/api/common"

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
): AxiosPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/edit"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
