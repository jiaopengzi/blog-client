/*
 * FilePath    : blog-client\src\api\membership\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员共用内容
 */

import type { PgSqlDateTime } from "@/api/common"
import type { User } from "@/api/user/getUsers"
import type { DataWithImg } from "@/components/common"

// 会员状态
export enum MembershipStatus {
    Disabled = 1, // 禁用
    Enabled = 2, //
}

// 会员状态显示
export const MembershipStatusDisplay: Record<MembershipStatus, string> = {
    [MembershipStatus.Disabled]: "❌禁用",
    [MembershipStatus.Enabled]: "✅启用",
}

// 获取会员状态选项
export const getMembershipStatusOptions = () => {
    return [
        { label: MembershipStatusDisplay[MembershipStatus.Disabled], value: MembershipStatus.Disabled },
        { label: MembershipStatusDisplay[MembershipStatus.Enabled], value: MembershipStatus.Enabled },
    ]
}

export interface InsertMembershipRequest {
    role: string // 会员角色
    price?: string // 价格(分)
    duration_time?: string // 有效时间(秒), 0表示永久有效
    purchase_discount?: number // 购买折扣 0-100
    download_count?: number // 下载次数
    watch_count?: number // 观看次数
    status: MembershipStatus // 状态 1禁用, 2启用
    description?: string // 描述
}

export interface UpdateMembershipRequest extends InsertMembershipRequest {
    id: string // 会员id
}

// 会员
export interface MembershipRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    role: string // 会员角色
    price: string // 价格(分)
    duration_time: string // 有效时间(秒), 0表示永久有效
    purchase_discount: number // 购买折扣 0-100
    download_count: number // 下载次数
    watch_count: number // 观看次数
    status: MembershipStatus // 状态 1禁用, 2启用
    description: string // 描述
}

export interface MembershipUserRes extends DataWithImg {
    id: string
    created_at: string
    user_id: string
    membership_id: string
    order_id: string
    role: string
    expire_time: PgSqlDateTime
    user_info: MembershipUserInfo
}

export interface MembershipUserInfo extends User, DataWithImg {
    subscribe_status: number
}
