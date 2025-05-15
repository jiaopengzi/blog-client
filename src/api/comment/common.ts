/*
 * FilePath    : blog-client\src\api\comment\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论共用内容
 */

import { type User } from "@/api/user/getUserInfo"

// 评论状态
export enum CommentReviewCode {
    Pending = 1, // 待审核
    Approved = 2, // 已审核
    Rejected = 3, // 被拒绝
}

// 评论状态显示
export const CommentStatusDisplay: Record<CommentReviewCode, string> = {
    [CommentReviewCode.Pending]: "待审核",
    [CommentReviewCode.Approved]: "已审核",
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
export interface CommentRes {
    id: string // id
    created_at: string // 创建时间
    post_id: string // 文章ID
    content: string // 评论内容
    user_id: string // 用户ID
    is_pinned: CommentPinnedCode // 是否置顶
    is_post_author: CommentIsPostAuthorCode // 是否为文章作者
    ip_country: string // IP国家
    ip_region_name: string // IP地区名称
    user_info: User // 用户信息
}

// 管理员查看评论
export interface CommentResAdmin extends CommentRes {
    updated_at: string // 更新时间
    status: CommentReviewCode // 评论状态
    ip_address: string // IP地址
    ip_city: string // IP城市
    user_agent: string // 用户代理
}
