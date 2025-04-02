/*
 * FilePath    : blog-client\src\components\editor\components\preview\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface PreviewRef extends HTMLElement {
    root: HTMLElement
    navigateToHeading: (index: number) => void
    navigateToElement: (index: number, callback?: () => void) => void
    navigateGoHome: (behavior: ScrollBehavior) => void
    navigateGoEnd: (behavior: ScrollBehavior) => void
}

export interface PreviewProps {
    preview: {
        html: string // html 内容
        imgUrls: string[] // 图片地址 list
        isShowElImageViewer: boolean // 是否显示图片预览
    } // 预览内容
    width?: string // 宽度
    height?: string // 高度
    isShowPreviewWechat?: boolean // 是否显示微信预览
    isUserScrollPreview?: boolean // 是否用户滚动预览
}
