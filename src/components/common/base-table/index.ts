/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:25:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-25 14:52:36
 * @FilePath     : \blog-client\src\components\common\base-table\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

import { ImgFit } from '@/components/common'

// 表格图片配置
export interface TableImg {
  url: string // 图片地址
  width?: number // 图片宽度
  height?: number // 图片高度
  'object-fit'?: ImgFit // 图片填充方式 cover | contain | fill | none | scale-down
}

// 具有 img 属性的数据类型
export type DataWithImg = {
  img?: TableImg
}

// 表格列配置
export interface TableColumn {
  prop: string
  label: string
  sortable?: boolean | undefined
  width?: number
  align?: string
  isImg?: boolean
}

// 文章分类
export interface PostCategory extends DataWithImg {
  id: number
  name: string
  description: string
  count: number
  slug?: string
  parentID?: number
  parentName?: string
}

// 文章
export interface Post extends DataWithImg {
  id: number
  title: string
  author: string
  price: number
  categories: string[]
  tags: string[]
  views: number
  createdAt: string
  updatedAt?: string
  slug?: string
}

export interface Media extends DataWithImg {
  id: number
  fileName: string
  author: string
  uploadDate: string
  description?: string
  slug?: string
}

export type TableData = PostCategory | Post | Media
