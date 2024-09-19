/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-19 17:31:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-19 17:31:54
 * @FilePath     : \blog-client\types\global.d.ts
 * @Description  : 扩展全局类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// document 全屏属性
interface Document {
  webkitFullscreenElement?: Element
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
}
