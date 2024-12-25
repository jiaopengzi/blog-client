/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-25 11:41:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-25 11:44:02
 * @FilePath     : \blog-client\src\components\hooks\useHome\types.ts
 * @Description  : 类型约束
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type NumberKeys } from "@/components/common"
import { type ViewPostRequest } from "@/api/post/view"

// 查询参数
export type QueryRecord<T extends string | number | symbol> = { [key in T]?: string | number }

// 面包屑
export interface BreadcrumbItem {
    display: string // 显示的文字
    to: string // 跳转的路由
}

// 请求参数选项
export interface Options<K> {
    queryNumberParams?: NumberKeys<K>[] // 查询参数中的数字参数
    noRequest?: QueryRecord<keyof K> // 不请求的参数值比如全部,只显示在路由中，不请求.
}

// 类型别名 ViewPostResKey 为 queryParams 的 key
export type ViewPostResKey = keyof ViewPostRequest
