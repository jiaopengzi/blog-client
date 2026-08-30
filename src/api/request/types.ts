/*
 * FilePath    : blog-client-nuxt\src\api\request\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 请求相关类型 (阶段 1 重写: 去除 axios 依赖)
 */

/*
 * 补充说明:
 * 原文件从 axios 引入 AxiosProgressEvent; 此处改为结构类型,
 * 保持 api 模块签名兼容 (ResPromise/ResResponse 见 @/api/response/types)
 */

// 上传进度事件 (结构类型, 兼容 axios ProgressEvent 常用字段)
export interface ReqProgressEvent {
    loaded?: number // 已上传字节数
    total?: number // 总字节数
    progress?: number // 进度 0-1
    lengthComputable?: boolean // 是否可计算进度
}

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

// url 中的分页参数键名
export enum PaginationParamsInURL {
    current_page = "current_page",
    page_size = "page_size",
}

// url 中的文章明细参数键名
export enum PostDetailParamsInURL {
    post_id = "post_id",
}

// url 中的关键字参数键名
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
    persistKeys?: (keyof K)[] // 路由同步时保留的参数 (如 /category/[slug] 注入的筛选参数, 不被 URL query 覆盖)
    refreshPromiseFns?: (() => Promise<void>)[] // 需要刷新的异步函数列表
    refreshFns?: (() => void)[] // 需要刷新的函数列表

    highlight_fields?: string[] // 高亮字段 可以为空
    pre_tags?: string // 高亮前缀 可以为空
    post_tags?: string // 高亮后缀 可以为空
    hash?: string // hash 值 可以为空
}
