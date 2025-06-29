/*
 * FilePath    : blog-client\src\components\common\pay-content\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容类型
 */

export enum PayType {
    Read = "read", // 付费阅读
    Download = "download", // 付费下载
}

export interface PayContentProps {
    payType?: PayType // 支付类型
    isPaid?: boolean // 是否付费阅读
    price?: number // 价格
    markdown: string
}
