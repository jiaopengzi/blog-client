/**
 * FilePath    : blog-client\src\components\common\media-edit\media-info\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface MediaInfoProps {
    file_id: string // 文件ID
    is_generate_hls: boolean // 是否生成 HLS
    file_name_display: string // 显示名称
    description: string // 描述
    file_id_hash: string // 文件id哈希
    file_url: string // 文件地址
    is_free: boolean // 是否免费
    is_video: boolean // 是否为视频
}
