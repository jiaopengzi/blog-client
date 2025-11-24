/**
 * FilePath    : blog-client-dev\src\components\common\carousel-manage\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 轮播图管理
 */

export interface CarouselFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: CarouselItem[]
}

export interface CarouselItem {
    imageUrl: string // 图片地址
    linkUrl?: string // 点击跳转地址
    altText?: string // 图片替代文本
}
