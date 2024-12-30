/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:23:06
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:23:23
 * @FilePath     : \blog-client\src\components\common\month-archive\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type PostCountByMonth } from "@/api/post/getPostCountByMonth"

export interface MonthArchiveData extends PostCountByMonth {
    year_month: string
}
