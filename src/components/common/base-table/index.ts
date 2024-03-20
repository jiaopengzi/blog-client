/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:25:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-20 16:44:30
 * @FilePath     : \blog-client\src\components\common\base-table\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type DataWithImg } from '@/components/common' // 图片填充方式
import type { User } from '@/api/user/getUsers'

export { default } from './index.vue'

// 表格列配置
export interface TableColumn {
  prop: string | number // 对应数据的字段名
  label: string // 列名
  sortable?: boolean | undefined // 是否可排序
  width?: number | string // 列宽
  align?: string // 对齐方式
  isImg?: boolean // 是否为图片
}

// 文章分类
export interface PostCategory extends DataWithImg {
  id: number // 分类 ID
  name: string // 分类名称
  description: string // 分类描述
  count: number // 分类下文章数量
  slug?: string // 分类别名
  parentID?: number // 父分类 ID
  parentName?: string // 父分类名称
}

// 文章
export interface Post extends DataWithImg {
  id: number // 文章 ID
  title: string // 文章标题
  author: string // 作者
  price: number // 价格
  categories: string[] // 分类
  tags: string[] // 标签
  views: number // 阅读量
  createdAt: string // 创建时间
  updatedAt?: string // 更新时间
  slug?: string // 文章别名
}

// 媒体
export interface Media extends DataWithImg {
  id: number // 媒体 ID
  fileName: string // 文件名
  author: string // 作者
  uploadDate: string // 上传时间
  description?: string // 描述
  slug?: string // 别名
}

export type TableData = PostCategory | Post | Media | User
