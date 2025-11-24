/**
 * FilePath    : blog-client-dev\src\components\common\media-edit\subtitles-info\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface SubtitlesForm {
    file_id: string // 视频文件id
    language: string // 字幕语言
    label: string // 字幕标签
    subtitles: string // 字幕
}
