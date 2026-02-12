/*
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心类型定义
 */

import type { TransactionType } from "@/api/billingCenter/common"

// url query key
export enum queryKey {
    Type = "type",
    KeyWord = "key_word",
    DateStart = "date_start",
    DateEnd = "date_end",
}

// 交易流水分组统计项
export interface TransactionFlowGroupItem {
    type: TransactionType // 交易类型
    display: string // 显示文本
    count: number // 数量
}
