/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-29 12:15:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 11:27:54
 * @FilePath     : \blog-client\src\api\response\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { AxiosPromise, AxiosResponse } from "axios"
export type { AxiosPromise as ResPromise, AxiosResponse as ResResponse }

// 统一响应结构
export interface Res<T> {
    code: number
    msg: string
    data: T // 可以根据实际返回的数据结构替换为更具体的类型
}

// 分页
export interface Pagination<T> {
    total: number // 总记录数量
    current_page: number // 当前页
    page_size: number // 每页显示条数
    page_count: number // 总页数
    page_sizes: number[] // 每页显示个数选择器的选项设置
    records: T[] // 数据
}
