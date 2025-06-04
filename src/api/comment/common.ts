/*
 * FilePath    : blog-client\src\api\comment\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论共用内容
 */

import { CommentStatusCode, PostStatusCode } from "@/api/post/common"
import { type User } from "@/api/user/getUserInfo"
import { type DataWithImg } from "@/components/common" // 图片填充方式

// 评论状态
export enum CommentReviewCode {
    Pending = 1, // 待审核
    Approved = 2, // 已审核
    Rejected = 3, // 被拒绝
}

// 评论状态显示
export const CommentStatusDisplay: Record<CommentReviewCode, string> = {
    [CommentReviewCode.Pending]: "待审核",
    [CommentReviewCode.Approved]: "已通过",
    [CommentReviewCode.Rejected]: "被拒绝",
}

// 获取评论状态选项
export const getCommentStatusOptions = () => {
    return [
        { label: CommentStatusDisplay[CommentReviewCode.Pending], value: CommentReviewCode.Pending },
        { label: CommentStatusDisplay[CommentReviewCode.Approved], value: CommentReviewCode.Approved },
        { label: CommentStatusDisplay[CommentReviewCode.Rejected], value: CommentReviewCode.Rejected },
    ]
}

// 评论是否置顶
export enum CommentPinnedCode {
    NotIsPinned = 1, // 1 非置顶
    IsPinned = 2, // 2 置顶
}

// 评论是否为文章作者
export enum CommentIsPostAuthorCode {
    NotIsPostAuthor = 1, // 非文章作者
    IsPostAuthor = 2, // 文章作者
}

// 评论
export interface CommentRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    post_id: string // 文章ID
    content: string // 评论内容
    user_id: string // 用户ID
    is_pinned: CommentPinnedCode // 是否置顶
    is_post_author: CommentIsPostAuthorCode // 是否为文章作者
    user_info: User // 用户信息
}

// 按照评论状态统计评论数量
export interface CommentCountByStatus {
    status: CommentReviewCode // 文章状态
    count: number // 评论数量
}

// 评论对应的文章信息
export interface CommentPostRes {
    id: string // 标签id
    created_at: string // 创建时间
    comment_count: string // 评论数量
    comment_count_by_status: CommentCountByStatus[] // 评论数量
    post_status: PostStatusCode // 文章状态
    comment_status: CommentStatusCode // 评论状态
    post_author: string // 文章作者
    post_title: string // 文章标题
    slug: string // 别名
    thumbnail: string // 缩略图
}

// 管理员查看评论
export interface CommentResAdmin extends CommentRes {
    updated_at: string // 更新时间
    status: CommentReviewCode // 评论状态
    ip_address: string // IP地址
    user_agent: string // 用户代理
    post_info: CommentPostRes // 文章信息
}
