/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-08 12:51:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-10 20:15:08
 * @FilePath     : \blog-client\src\api\common.ts
 * @Description  : 公用
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// postgresql 日期时间 格式
export interface PgSqlDateTime {
    Time: Date | null // 禁用到期时间
    Valid: boolean
}
