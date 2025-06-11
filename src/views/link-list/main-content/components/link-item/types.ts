/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\link-list\link-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type LinkRes } from "@/api/link/common"

export interface LinkItemProps {
    data: LinkRes
    size?: number // 图片大小
    isShowDescription?: boolean // 是否显示描述
    truncatedCount?: number // 截断的字符数
}
