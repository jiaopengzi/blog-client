/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:21:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:22:12
 * @FilePath     : \blog-client\src\views\user-info\component\info\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
