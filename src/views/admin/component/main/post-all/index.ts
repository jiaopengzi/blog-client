/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-23 17:05:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 17:35:06
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\index.ts
 * @Description  : 查看所有文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

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
}

export const groupList = [queryKey.Group, queryKey.PostAuthor, queryKey.PostStatus] as const
export type GroupType = (typeof groupList)[number]
export interface PostCountGroupItem {
    display: string
    group: GroupType
    key: string
    count: number
    index: number
}
