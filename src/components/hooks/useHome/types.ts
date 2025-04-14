/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type ViewPostRequest } from "@/api/post/view"

// 类型别名 ViewPostReqKey 为 queryParams 的 key
export type ViewPostReqKey = keyof ViewPostRequest
