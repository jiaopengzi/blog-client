/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 15:50:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 14:46:56
 * @FilePath     : \blog-client\src\components\common\base\tag-item\type.ts
 * @Description  : 标签数据对象
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export interface TagDataObj {
  path: string // 标签路径
  lablel: string // 标签名称
  tagPostNum: number // 标签下文章数量
}
// 标签对象
export type Tag = { data: TagDataObj; color: TagColor }

// 标签颜色对象
export type TagColor = { color: string; bgColor: string }
