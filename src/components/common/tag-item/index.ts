/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 14:44:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-18 17:15:44
 * @FilePath     : \blog-client\src\components\common\tag-item\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

export interface TagDataObj {
  path: string // 标签路径
  label: string // 标签名称
  tagPostNum: number // 标签下文章数量
}
// 标签对象
export type Tag = { data: TagDataObj; color: TagColor }

// 标签颜色对象
export type TagColor = { color: string; bgColor: string }
