/*
 * FilePath    : blog-client\src\components\common\post-detail\components\interaction\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export type InteractionIcon = "like" | "star" | "share" | "link" // 互动类型

export interface InteractionItemProps {
    icon: InteractionIcon // 图标
    text: string // 文本
    tip?: string | number // 提示信息
    isActive?: boolean // 是否激活
}

export interface InteractionProps {
    direction: "horizontal" | "vertical" // 方向
    items?: InteractionItemProps[] // 互动列表
}

export interface InteractionItem extends InteractionItemProps {
    onClick?: () => void // 点击事件
}
