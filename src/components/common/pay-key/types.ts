/*
 * FilePath    : blog-client\src\components\common\pay-content\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容类型
 */

export interface PayKeyProps {
    productId: string // 产品ID
    title?: string // 标题
    description?: string // 描述
    loading?: boolean // 加载状态
}
