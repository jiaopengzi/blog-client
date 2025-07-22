/*
 * FilePath    : blog-client\src\views\admin\component\main\post-all\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

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
