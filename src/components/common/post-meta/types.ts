/*
 * FilePath    : blog-client\src\components\common\post-meta\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章元数据类型
 */

import { PayStrategy, type PostVideoTocTree } from "@/api/post/common"

export interface PostMetaProps {
    post_id?: string // 文章ID
    created_at?: string // 创建时间
    timeZone?: string // 时区，默认 Asia/Shanghai
    formatStr?: string // 格式化字符串，默认 YYYY-MM-DD HH:mm:ss
    comment_count?: string // 评论数量
    is_comment_status_open?: boolean // 是否开启评论状态
    view_count?: string // 查看数量
    like_count?: string // 喜欢数量
    star_count?: string // 收藏数量
    words_count?: string // 文章字数
    post_title?: string // 文章标题
    author_avatar?: string // 文章作者头像
    author_user_name?: string // 文章作者用户名
    author_display_name?: string // 文章作者显示名称
    avatar_size?: number // 头像大小，默认 24px
    author_id?: string // 文章作者ID
    is_show_read_time?: boolean // 是否显示阅读时间
    is_immersion_read?: boolean // 是否沉浸式阅读
    is_author_edit?: boolean // 是否作者编辑
    interactionStatus?: {
        is_like: boolean // 是否点赞
        is_star: boolean // 是否收藏
    }

    is_paid?: boolean // 是否付费阅读
    pay_strategy?: PayStrategy // 付费策略
    pay_roles?: string[] // 付费角色
    price?: string // 价格(单位：分)
    videoToc?: PostVideoTocTree[] // 付费视频目录
}

// 返回一个空的 PostMetaProps 对象
export const emptyPostMetaProps = (): PostMetaProps => {
    return {
        post_id: "", // 文章ID
        created_at: "", // 创建时间
        timeZone: "Asia/Shanghai", // 时区，默认 Asia/Shanghai
        formatStr: "YYYY-MM-DD HH:mm:ss", // 格式化字符串，默认 YYYY-MM-DD HH:mm:ss
        comment_count: "", // 评论数量
        is_comment_status_open: false, // 是否开启评论状态
        view_count: "", // 查看数量
        like_count: "", // 喜欢数量
        star_count: "", // 收藏数量
        words_count: "", // 文章字数
        post_title: "", // 文章标题
        author_avatar: "", // 文章作者头像
        author_user_name: "", // 文章作者用户名
        author_display_name: "", // 文章作者显示名称
        avatar_size: 24, // 头像大小，默认 24px
        author_id: "", // 文章作者ID
        is_show_read_time: true, // 是否显示阅读时间
        is_immersion_read: false, // 是否沉浸式阅读
        is_author_edit: false, // 是否作者编辑
        interactionStatus: {
            is_like: false, // 是否点赞
            is_star: false, // 是否收藏
        },
        is_paid: false, // 是否付费阅读
        pay_strategy: PayStrategy.All, // 付费策略
        pay_roles: [], // 付费角色
        price: "0", // 价格(单位：分)
        videoToc: [], // 付费视频目录
    }
}
