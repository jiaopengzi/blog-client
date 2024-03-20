/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:38:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-20 16:59:15
 * @FilePath     : \blog-client\src\components\common\index.ts
 * @Description  : 公用信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 图片填充方式
export enum ImgFit {
  cover = 'cover',
  contain = 'contain',
  fill = 'fill',
  none = 'none',
  'scale-down' = 'scale-down',
}

// 分页
export interface Pagination {
  total_pages: number // 总页数
  current_page: number // 当前页
  page_size: number // 每页显示条数
  page_sizes: number[] // 每页显示个数选择器的选项设置
}

// 表格图片配置
export interface TableImg {
  url: string // 图片地址
  width?: number // 图片宽度
  height?: number // 图片高度
  'object-fit'?: ImgFit // 图片填充方式 cover | contain | fill | none | scale-down
}

// 具有 img 属性的数据类型
export type DataWithImg = {
  img?: TableImg // 图片
}

// 枚举 alert 弹窗 element 组件类型
export enum MsgType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

// 枚举 alert 弹窗 element 组件标题
export enum MsgTitle {
  success = '成功',
  info = '提示',
  warning = '警告',
  error = '错误',
}
