/*
 * FilePath    : blog-client-nuxt\src\components\views\link-list\link-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type LinkRes } from "@/api/link/common"

export interface LinkItemProps {
    data: LinkRes
    size?: number
    isShowDescription?: boolean
    truncatedCount?: number
}
