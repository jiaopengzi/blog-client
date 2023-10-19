/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-13 14:52:34
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-19 16:53:42
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
  ? defineAsyncComponent(() => import('@/components/common/mobile/HeaderMobile.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/HeaderPC.vue'))

// 底部
const footerComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/FooterMobile.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/FooterPC.vue'))

// 登录
const loginComponent = () => import('@/components/common/LoginPage.vue')

// 注册
const registerComponent = () => import('@/components/common/RegisterPage.vue')

// 忘记密码
const resetPasswordComponent = () => import('@/components/common/ResetPassword.vue')

const socialLoginCallbackComponent = () => import('@/components/common/SocialLoginCallback.vue')

// 内容页
const contentComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/ContentMobile.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/ContentPC.vue'))

// 用户中心
const userInfoComponent = isMobileDevice
  ? defineAsyncComponent(() => import('@/components/common/mobile/UserInfoMobile.vue'))
  : defineAsyncComponent(() => import('@/components/common/pc/UserInfoPC.vue'))

// 导出
export {
  headerComponent,
  footerComponent,
  loginComponent,
  registerComponent,
  resetPasswordComponent,
  socialLoginCallbackComponent,
  contentComponent,
  userInfoComponent,
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
