/*
 * FilePath    : blog-client\src\components\editor\components\preview\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type PostVideoTocTree } from "@/api/post/common"

import { CommandsKey } from "../../command"

export type HeadingObject = {
    id: string // 标题 id
    index: number // 标题索引
    element: HTMLHeadingElement // 标题元素
}

export interface ViewCommand {
    commandName: CommandsKey
    time: Date | null
}

export type ScrollMethod = "scrollIntoView" | "scrollTo" // 滚动方法

export interface PreviewProps {
    html: string // html 内容
    imgUrls: string[] // 图片地址 list
    isShowElImageViewer: boolean // 是否显示图片预览
    width?: string // 宽度
    height?: string // 高度
    isShowPreviewWechat?: boolean // 是否显示微信预览
    isUserScrollPreview?: boolean // 是否用户滚动预览
    isEmit?: boolean // 是否触发事件
    isRemoveFirstH1?: boolean // 是否移除第一个 H1 标签
    viewCommand?: ViewCommand // 命令
    headingShowCurrentIndex?: number // 当前展示的标题的索引
    isWatchMouse?: boolean // 是否监听鼠标事件

    scrollMethod?: ScrollMethod // 滚动方法;

    root?: ScrollContainer
    rootMargin?: string
    threshold?: number | number[]

    createOrderLoading?: boolean // 创建订单加载状态
    isPaid?: boolean // 是否付费阅读
    price?: string // 价格(单位：分)
    postId?: string // 文章ID
    isAdminVideo?: boolean // 是否使用管理员视频接口
    videoToc?: PostVideoTocTree[] // 付费视频目录
}
