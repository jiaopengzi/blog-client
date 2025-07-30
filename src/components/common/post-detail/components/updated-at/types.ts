/*
 * FilePath    : blog-client\src\components\common\post-detail\components\updated-at\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface UpdatedAtProps {
    time: string // 更新时间
    timeZone?: string // 时区，默认 Asia/Shanghai
    formatStr?: string // 格式化字符串，默认 YYYY-MM-DD HH:mm:ss
}
