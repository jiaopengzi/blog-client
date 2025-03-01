/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:06:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:06:15
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
