/*
 * FilePath    : blog-client\src\components\common\post-list-admin\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { RouteNames } from "@/router"

import { type PostUpsertProps } from "../post-upsert"

// url query key
export enum queryKey {
    Group = "group",
    PostAuthor = "post_author",
    PostStatus = "post_status",
    Year = "year",
    Month = "month",
    PostCategoryID = "post_category_id",
    PostTagID = "post_tag_id",
    CustomFiled = "custom_filed",
    CustomFiledMin = "custom_filed_min",
    CustomFiledMax = "custom_filed_max",
    KeyWord = "key_word",
    IsPinned = "is_pinned",
    IsRecommended = "is_recommended",
    PostType = "post_type",
}

export const groupList = [queryKey.Group, queryKey.PostAuthor, queryKey.PostStatus, queryKey.IsPinned, queryKey.IsRecommended] as const

export type GroupType = (typeof groupList)[number]

export interface PostCountGroupItem {
    display: string
    group: GroupType
    key: string
    count: number
    index: number
}

// 后台文章列表组件的属性类型
export interface PostListAdminProps extends PostUpsertProps {
    writeRouteName: RouteNames // 写入的路由
    isSelectMode?: boolean // 是否作为内容选择器使用, 会显示选择列但不显示批量删除按钮
    isSyncRoute?: boolean // 是否同步查询参数到路由, 弹窗内建议关闭
    tableHeight?: string | number // 表格高度
    disableHead?: boolean // 是否禁用页面标题更新
}
