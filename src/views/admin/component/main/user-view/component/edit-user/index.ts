/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:46:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-10 18:44:02
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\edit-user\index.ts
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export { default } from "./index.vue"
import { type PgSqlDateTime } from "@/api/common"

export interface EditUserByAdminForm {
    editUserID: string // 编辑用户ID
    userName: string // 用户名
    email: string // 邮箱
    disableExpiresAt: PgSqlDateTime
    password: string // 密码
    roleName: string // 角色
    nickName: string // 昵称
    sex: string // 性别
    description: string // 描述
}
