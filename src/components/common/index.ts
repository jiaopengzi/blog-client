/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:38:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-23 20:33:36
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
  totalPages: number
  currentPage: number
  pageSize: number
  pageSizes: number[]
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
