/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type ViewPostRequest } from "@/api/post/view"

// 面包屑
export interface BreadcrumbItem {
    display: string // 显示的文字
    to: string // 跳转的路由
}

// 类型别名 ViewPostResKey 为 queryParams 的 key
export type ViewPostResKey = keyof ViewPostRequest
