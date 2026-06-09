/**
 * FilePath    : blog-client\src\components\common\thumbnail-select-dialog\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 缩略图选择弹窗类型定义
 */

export interface ThumbnailSelectOption {
    index: number // 候选图在当前列表中的顺序, 从 1 开始
    url: string // 候选图地址
}
