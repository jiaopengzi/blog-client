/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-13 14:52:34
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-29 21:12:10
 * @FilePath     : \blog-client\src\components\common\index.ts
 * @Description  : 通用组件导出
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { defineAsyncComponent } from 'vue'

// 检测当前设备是否为移动设备
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
)

// 头部
const headerComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/Header.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/Header.vue'))

// 底部
const footerComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/Footer.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/Footer.vue'))

// 内容页
const contentComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/Content.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/content/Index.vue'))

// 用户中心
const userInfoComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/UserInfo.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/userInfo/Index.vue'))

// 导出
export { headerComponent, footerComponent, contentComponent, userInfoComponent }

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
