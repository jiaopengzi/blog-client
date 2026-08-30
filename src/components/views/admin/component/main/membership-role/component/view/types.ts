/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\membership-role\component\view\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { MembershipStatus } from "@/api/membership/common"

export interface ViewForm {
    id?: string // ID
    role: string // 会员角色
    price: number // 价格
    duration_time: number // 有效时间(秒), 0 表示永久有效
    purchase_discount: number // 购买折扣, 0-100
    download_count?: number // 下载次数
    watch_count?: number // 观看次数
    status: MembershipStatus // 状态, 1 禁用, 2 启用
    description?: string // 描述
}

export interface TimeItem {
    value: number // 时间值(秒)
    display: string // 显示文本
}
