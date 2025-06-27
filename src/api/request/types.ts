/**
 * @FilePath     : \blog-client\src\api\request\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 请求相关类型
 */

import type { AxiosProgressEvent } from "axios"
export type { AxiosProgressEvent as ReqProgressEvent }

export type QueryParamsRecord<T extends string | number | symbol> = {
    [key in T]?: string | number | boolean
}

// 分页请求参数
export interface PaginationWithoutKeyWord {
    current_page?: number // 当前页
    page_size?: number // 每页显示条数
}

// 分页请求参数
export interface PaginationRequest extends PaginationWithoutKeyWord {
    key_word?: string // 关键字
}

// url 中是分页参数键名 PaginationParamsInURL 的对象
export enum PaginationParamsInURL {
    current_page = "current_page",
    page_size = "page_size",
}

// url 中是文章明细参数键名 PostDetailParamsInURL 的对象
export enum PostDetailParamsInURL {
    post_id = "post_id",
}

// url 中是关键字参数键名 KeyWordParamsInURL 的对象
export enum KeyWordParamsInURL {
    key_word = "key_word",
}

// 请求参数选项
export interface QueryParamsOptions<K> {
    stringKeys?: StringKeys<K>[] // 查询参数中的字符串参数
    numberKeys?: NumberKeys<K>[] // 查询参数中的数字参数
    booleanKeys?: BooleanKeys<K>[] // 查询参数中的布尔参数
    noRequestKeys?: QueryParamsRecord<keyof K> // 不请求的参数
    noRouteKeys?: (keyof K)[] // 不参与路由的参数
    refreshPromiseFns?: (() => Promise<void>)[] // 需要刷新的函数列表
    refreshFns?: (() => void)[] // 需要刷新的函数列表

    highlight_fields?: string[] // 高亮字段 可以为空
    pre_tags?: string // 高亮前缀 可以为空
    post_tags?: string // 高亮后缀 可以为空
    hash?: string // hash 值 可以为空
}
