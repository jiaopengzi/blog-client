/*
 * FilePath    : blog-client\src\views\admin\component\main\membership-user\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员用户页面类型
 */

import type { MembershipUserAdjustAction } from "@/api/membership/common"

// url query key
export enum queryKey {
    Group = "group",
    UserID = "user_id",
    IsExpired = "is_expired",
    KeyWord = "key_word",
}

export const groupList = [queryKey.Group, queryKey.IsExpired] as const

export type GroupType = (typeof groupList)[number]

export interface MembershipUserCountGroupItem {
    display: string
    group: GroupType
    icon?: "unexpired" | "expired"
    key: string
    count: number
    index: number
}

export interface EditMembershipUserForm {
    id: string
    role: string
    userName: string
    expireTimeDisplay: string
    expireStatus: string
    historyRemark: string
    action: MembershipUserAdjustAction
    durationDays: number
    remark: string
}
