/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 17:20:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 21:17:23
 * @FilePath     : \blog-client\src\components\common\alert-tip\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

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
