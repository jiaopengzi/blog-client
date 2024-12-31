/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-25 11:41:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 12:42:25
 * @FilePath     : \blog-client\src\components\hooks\useHome\types.ts
 * @Description  : 类型约束
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type ViewPostRequest } from "@/api/post/view"

// 面包屑
export interface BreadcrumbItem {
    display: string // 显示的文字
    to: string // 跳转的路由
}

// 类型别名 ViewPostResKey 为 queryParams 的 key
export type ViewPostResKey = keyof ViewPostRequest
