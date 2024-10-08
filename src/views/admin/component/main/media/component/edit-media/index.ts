/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 10:24:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-08 09:57:13
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\edit-media\index.ts
 * @Description  : 媒体编辑组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'
import { type TableImg } from '@/components/common'

export interface EditMediaProps {
  file_id: string // 文件ID
  file_name: string // 文件名称
  file_type: string // 文件类型
  thumbnail: string // 缩略图
  file_name_display: string // 显示名称
  description: string // 描述
  slug: string // 文件别名
  is_free: boolean // 是否免费
  subtitles_language_list: string[] // 字幕
  img?: TableImg // 图片
  editDialogVisible?: boolean // 编辑弹窗是否显示
}

export interface EditMediaForm {
  file_id: string // 文件ID
  file_name_display: string // 显示名称
  description: string // 描述
  slug: string // 文件别名
  is_free: boolean // 是否免费
}

export interface SubtitlesForm {
  file_id: string // 视频文件id
  language: string // 字幕语言
  label: string // 字幕标签
  subtitles: string // 字幕
}
