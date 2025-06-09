/*
 * FilePath    : blog-client\src\api\link\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接共用内容
 */

import { type DataWithImg } from "@/components/common" // 图片填充方式

// 链接状态
export enum LinkStatusCode {
    Hidden = 1, // 隐藏
    Show = 2, // 显示
}

// 链接状态显示
export const LinkStatusDisplay: Record<LinkStatusCode, string> = {
    [LinkStatusCode.Hidden]: "隐藏",
    [LinkStatusCode.Show]: "显示",
}

// 获取链接状态选项
export const getLinkStatusOptions = () => {
    return [
        { label: LinkStatusDisplay[LinkStatusCode.Hidden], value: LinkStatusCode.Hidden },
        { label: LinkStatusDisplay[LinkStatusCode.Show], value: LinkStatusCode.Show },
    ]
}

export interface InsertLinkRequest {
    name: string // 名称
    url: string // 链接地址
    image: string // 图片地址
    description: string // 描述
    status?: LinkStatusCode // 状态
    order?: string // 排序
}

export interface UpdateLinkRequest extends InsertLinkRequest {
    id: string // 链接id
}

// 链接
export interface LinkRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    name: string // 评论者名称
    url: string // 评论者链接
    image: string // 评论者头像
    description: string // 评论内容
    status: LinkStatusCode // 评论状态
    order: string // 排序
}
