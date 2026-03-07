/*
 * FilePath    : blog-client\src\views\admin\component\main\membership\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// url query key
export enum queryKey {
    Group = "group",
    Status = "status",
    KeyWord = "key_word",
}

export const groupList = [queryKey.Group, queryKey.Status] as const

export type GroupType = (typeof groupList)[number]

export interface MembershipCountGroupItem {
    display: string
    group: GroupType
    key: string
    count: number
    index: number
}
