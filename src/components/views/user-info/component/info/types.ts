/*
 * FilePath    : blog-client-nuxt\src\components\views\user-info\component\info\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { SubscribeStatus } from "@/api/user/getUserInfo"

// info 表单数据
export interface EditForm {
    userName: string
    nickName: string
    subscribeStatus: SubscribeStatus
    sex: string
    description: string
}
