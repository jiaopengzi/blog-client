/*
 * FilePath    : blog-client\src\components\common\pay-content\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容类型
 */

export enum ContentPayType {
    Read = "read", // 付费阅读
    Download = "download", // 付费下载
}

export interface PayContentProps {
    content_pay_type?: ContentPayType // 内容费类型
    is_paid?: boolean // 是否付费阅读
    price?: string // 价格(单位：分)
    markdown: string
}
