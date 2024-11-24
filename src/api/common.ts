/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-08 12:51:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-24 18:31:55
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

// 使用ID列表删除请求参数
export interface DeleteByIDsRequest {
    id_list: string[]
}
