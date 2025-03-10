/**
 * @FilePath     : \blog-client\src\components\common\month-archive\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

import { type PostCountByMonth } from "@/api/post/getPostCountByMonth"

export interface MonthArchiveData extends PostCountByMonth {
    year_month: string
}
