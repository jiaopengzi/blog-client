/**
 * @FilePath     : \blog-client\src\components\common\media-edit\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type TableImg } from "@/components/common"

export interface EditMediaProps {
    file_id: string // 文件ID
    file_name: string // 文件名称
    file_type: string // 文件类型
    file_url: string // 文件地址
    thumbnail: string // 缩略图
    file_name_display: string // 显示名称
    description: string // 描述
    slug: string // 文件别名
    is_free: boolean // 是否免费
    is_generate_hls: boolean // 是否生成HLS
    subtitles_language_list: string[] // 字幕
    img?: TableImg // 图片
    editDialogVisible?: boolean // 编辑弹窗是否显示
}

export interface EditMediaForm {
    file_id: string // 文件ID
    file_name_display: string // 显示名称
    description: string // 描述
    slug: string // 文件别名
    file_url: string // 文件地址
    is_free: boolean // 是否免费
}

export interface SubtitlesForm {
    file_id: string // 视频文件id
    language: string // 字幕语言
    label: string // 字幕标签
    subtitles: string // 字幕
}
