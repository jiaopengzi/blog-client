/**
 * FilePath    : blog-client\src\components\common\media-edit\media-show\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type TableImg } from "@/components/common"

export interface MediaShowProps {
    file_id: string // 文件ID
    file_name: string // 文件名称
    file_type: string // 文件类型
    file_url: string // 文件地址
    thumbnail: string // 缩略图
    file_name_display: string // 显示名称
    description: string // 描述
    file_id_hash: string // 文件id哈希
    is_free: boolean // 是否免费
    is_generate_hls: boolean // 是否生成HLS
    subtitles_language_list: string[] // 字幕
    img?: TableImg // 图片
}
