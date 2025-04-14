/*
 * FilePath    : blog-client\src\components\hooks\useRootUtils\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type ViewPostRequest } from "@/api/post/view"
import { type ViewPostByIDRequest } from "@/api/post/viewByID"

export type QueryParams = Partial<ViewPostRequest> & Partial<ViewPostByIDRequest>

export type QueryParamsKey = keyof QueryParams
