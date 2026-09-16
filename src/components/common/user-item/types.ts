/*
 * FilePath    : blog-client\src\components\common\user-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户展示
 */

import { CommentIsPostAuthorCode } from "@/api/comment/common"
import { type User } from "@/api/user/getUserInfo"

export interface UserProps {
    user: User // 用户信息
    size?: number // 用户头像宽度
    isShowUserName?: boolean // 是否显示用户名
    isShowUserEmail?: boolean // 是否显示用户邮箱
    isShowUserDisplayName?: boolean // 是否显示用户昵称
    isShowCursorPointer?: boolean // 是否显示鼠标指针为手型

    commentIsPostAuthorCode?: CommentIsPostAuthorCode // 评论是否是文章作者
    createdAt?: string // 评论时间
}
