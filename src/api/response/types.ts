/*
 * FilePath    : blog-client-nuxt\src\api\response\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 响应类型 (阶段 1 重写: 去除 axios 依赖, 保持 ResPromise/ResResponse 命名兼容)
 */

// axios 风格响应形状 (data/status/statusText/headers/config), 由 ofetch 请求层塑形返回
export interface ResResponse<T = unknown> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
    config: unknown
}

export type ResPromise<T = unknown> = Promise<ResResponse<T>>

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
    highlight?: Record<string, string[]>[] // 高亮内容
}
