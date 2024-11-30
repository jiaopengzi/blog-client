/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-23 15:28:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-30 14:32:51
 * @FilePath     : \blog-client\src\api\post\common.ts
 * @Description  : 文章共用内容
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type PgSqlDateTime } from "@/api/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type User } from "@/api/user/getUserInfo"
import { type DataWithImg } from "@/components/common" // 图片填充方式

// 文章状态
export enum PostStatusCode {
    Draft = 1, // 草稿
    Private = 2, // 私密
    Future = 3, // 定时
    Password = 4, // 密码
    Publish = 5, // 发布
    Expired = 6, // 过期
}

// 文章状态显示
export const PostStatusDisplay: Record<PostStatusCode, string> = {
    [PostStatusCode.Draft]: "草稿",
    [PostStatusCode.Private]: "私密",
    [PostStatusCode.Future]: "定时",
    [PostStatusCode.Password]: "密码",
    [PostStatusCode.Publish]: "发布",
    [PostStatusCode.Expired]: "过期",
}

// 获取文章状态选项
export const gegPostStatusOptions = () => {
    return [
        { label: PostStatusDisplay[PostStatusCode.Draft], value: PostStatusCode.Draft },
        { label: PostStatusDisplay[PostStatusCode.Private], value: PostStatusCode.Private },
        { label: PostStatusDisplay[PostStatusCode.Future], value: PostStatusCode.Future },
        { label: PostStatusDisplay[PostStatusCode.Password], value: PostStatusCode.Password },
        { label: PostStatusDisplay[PostStatusCode.Publish], value: PostStatusCode.Publish },
        { label: PostStatusDisplay[PostStatusCode.Expired], value: PostStatusCode.Expired },
    ]
}

// 文章状态选项
export enum CommentStatusCode {
    Close = 1, // 关闭
    Open = 2, // 开启
}

// 插入文章请求
export interface InsertPostRequest {
    post_author: string // 文章作者
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_status: PostStatusCode // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
    post_password?: string // 文章密码
    comment_status: CommentStatusCode // 评论是否开启 0 关闭 1 开启
    price?: string // 价格
    seo_title?: string // SEO标题
    seo_keywords?: string // SEO关键词
    seo_description?: string // SEO描述
    slug?: string // 别名
    thumbnail?: string // 缩略图
    category_ids: string[] // 分类id
    tag_names?: string[] // 标签
    pay_roles?: string[] // 付费角色
    post_push_time?: PgSqlDateTime // 发布时间
    post_expired_time?: PgSqlDateTime // 过期时间
}

export type UpdateFields = keyof InsertPostRequest

// 更新文章请求
export interface UpdatePostRequest {
    id: string // 文章ID
    post_author?: string // 文章作者
    post_content?: string // 文章内容
    post_title?: string // 文章标题
    post_status?: PostStatusCode // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
    post_password?: string // 文章密码
    comment_status?: CommentStatusCode // 评论是否开启 0 关闭 1 开启
    price?: string // 价格
    seo_title?: string // SEO标题
    seo_keywords?: string // SEO关键词
    seo_description?: string // SEO描述
    slug?: string // 别名
    thumbnail?: string // 缩略图
    category_ids?: string[] // 分类id
    tag_names?: string[] // 标签
    pay_roles?: string[] // 付费角色
    post_push_time?: PgSqlDateTime // 发布时间
    post_expired_time?: PgSqlDateTime // 过期时间
    update_fields: UpdateFields[] // 显示指出需要更新的字段便于后端处理零值
}

// 文章
export interface PostRes extends DataWithImg {
    id: string // 标签id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    price: string // 价格
    comment_count: string // 评论数量
    view_count: string // 查看数量
    like_count: string // 喜欢数量
    collect_count: string // 收藏数量
    words_count: string // 字数
    post_type: number // 文章类型
    post_status: number // 文章状态
    comment_status: number // 评论状态
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_password: string // 文章密码
    seo_title: string // SEO标题
    seo_keywords: string // SEO关键字
    seo_description: string // SEO描述
    slug: string // 别名
    thumbnail: string // 缩略图
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间
}

// 文章信息
export interface PostInfoRes extends PostRes {
    author_info: User // 作者
    categories: PostCategory[] // 文章分类
    tags: PostTag[] // 文章标签
    pay_roles: string[] // 付费角色
}

// 文章自定义字段
export enum PostCustomFieldKey {
    Price = "price",
    ViewCount = "view_count",
    CommentCount = "comment_count",
    LikeCount = "like_count",
    CollectCount = "collect_count",
    WordsCount = "words_count",
}
