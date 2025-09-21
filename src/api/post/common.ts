/**
 * @FilePath     : \blog-client\src\api\post\common.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 文章共用内容
 */

import { type PgSqlDateTime } from "@/api/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type User } from "@/api/user/getUserInfo"
import { type DataWithImg } from "@/components/common" // 图片填充方式

export enum PostType {
    Post = "post", // 文章
    Page = "page", // 页面
    Video = "video", // 视频
}

export const PostTypeDisplay: Record<PostType, string> = {
    [PostType.Post]: "文章",
    [PostType.Page]: "页面",
    [PostType.Video]: "视频",
}

// 获取订单状态选项
export const getPostTypeOptions = () => {
    return Object.values(PostType)
        .filter((value) => typeof value === "string")
        .map((value) => ({
            label: PostTypeDisplay[value as PostType],
            value: value as PostType,
        }))
}

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
export const getPostStatusOptions = () => {
    return [
        { label: PostStatusDisplay[PostStatusCode.Draft], value: PostStatusCode.Draft },
        { label: PostStatusDisplay[PostStatusCode.Private], value: PostStatusCode.Private },
        { label: PostStatusDisplay[PostStatusCode.Future], value: PostStatusCode.Future },
        { label: PostStatusDisplay[PostStatusCode.Password], value: PostStatusCode.Password },
        { label: PostStatusDisplay[PostStatusCode.Publish], value: PostStatusCode.Publish },
        { label: PostStatusDisplay[PostStatusCode.Expired], value: PostStatusCode.Expired },
    ]
}

// 自定义字段
export enum CustomFields {
    Price = "price", // 价格
    ViewCount = "view_count", // 浏览次数
    CommentCount = "comment_count", // 评论次数
    LikeCount = "like_count", // 点赞次数
    StarCount = "star_count", // 收藏次数
    WordsCount = "words_count", // 字数
}

// 自定义字段显示
export const CustomFieldsDisplay: Record<CustomFields, string> = {
    [CustomFields.Price]: "价格",
    [CustomFields.ViewCount]: "浏览",
    [CustomFields.CommentCount]: "评论",
    [CustomFields.LikeCount]: "点赞",
    [CustomFields.StarCount]: "收藏",
    [CustomFields.WordsCount]: "字数",
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
    is_pinned?: number // 是否置顶
    is_recommended?: number // 是否推荐阅读
    post_type?: PostType // 文章类型
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
    is_pinned?: number // 是否置顶
    is_recommended?: number // 是否推荐阅读
    post_type?: PostType // 文章类型
    update_fields: UpdateFields[] // 显示指出需要更新的字段便于后端处理零值
}

// 文章
export interface PostResCommon extends DataWithImg {
    id: string // 标签id
    created_at: string // 创建时间
    comment_count: string // 评论数量
    view_count: string // 查看数量
    like_count: string // 喜欢数量
    star_count: string // 收藏数量
    post_status: PostStatusCode // 文章状态
    post_title: string // 文章标题
    slug: string // 别名
    thumbnail: string // 缩略图
    is_pinned: number // 是否置顶
    is_recommended: number // 是否推荐阅读
}

// 文章
export interface PostResPagination extends PostResCommon {
    // 引用类型
    author_info: User // 作者
    categories: PostCategory[] // 文章分类
    tags: PostTag[] // 文章标签
    seo_description: string // SEO描述
}

// 文章
export interface PostResPaginationByAdmin extends PostResCommon {
    updated_at: string // 更新时间
    price: string // 价格
    post_type: PostType // 文章类型
    comment_status: number // 评论状态
    post_title: string // 文章标题
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间

    // 引用类型
    author_info: User // 作者
    categories: PostCategory[] // 文章分类
    tags: PostTag[] // 文章标签
    pay_roles: string[] // 付费角色
}

// 文章
export interface PostResByAdmin extends PostResCommon {
    updated_at: string // 更新时间
    price: string // 价格
    words_count: string // 字数
    post_type: PostType // 文章类型
    comment_status: number // 评论状态
    post_content_paid: string // 文章内容
    post_title: string // 文章标题
    post_password: string // 文章密码
    seo_title: string // SEO标题
    seo_keywords: string // SEO关键字
    seo_description: string // SEO描述
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间

    // 引用类型
    author_info: User // 作者
    categories: PostCategory[] // 文章分类
    tags: PostTag[] // 文章标签
    pay_roles: string[] // 付费角色
}

// 文章
export interface PostResByID extends PostResCommon {
    updated_at: string // 更新时间
    price: string // 价格
    words_count: string // 字数
    post_type: PostType // 文章类型
    comment_status: number // 评论状态
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_password: string // 文章密码
    seo_title: string // SEO标题
    seo_keywords: string // SEO关键字
    seo_description: string // SEO描述
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间
    is_paid: boolean // 是否已付费

    // 引用类型
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
    StarCount = "star_count",
    WordsCount = "words_count",
}
