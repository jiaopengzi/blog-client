/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\user-view\component\edit-user\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type PgSqlDateTime } from "@/api/common"

export interface EditUserByAdminForm {
    editUserID: string
    userName: string
    email: string
    disableExpiresAt: PgSqlDateTime
    password: string
    roleName: string
    nickName: string
    sex: string
    description: string
}
