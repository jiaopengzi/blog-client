/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-04 20:59:19
 * @FilePath     : \blog-client\typings\vue3-slide-verify.d.ts
 * @Description  : 手动编写的vue3-slide-verify.d.ts文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

declare module 'vue3-slide-verify' {
  import { DefineComponent, ComponentPublicInstance } from 'vue'

  export type SlideVerifyProps = {
    l: number
    r: number
    w: number
    h: number
    sliderText: string
    accuracy: number
    show: boolean
    imgs: any[]
  }

  export type SlideVerifyEmits = {
    success: (timestamp: number) => void
    again: () => void
    fail: () => void
    refresh: () => void
    fulfilled: () => void
  }

  export type RawBindings = {
    refresh: () => void
  }

  export type SlideVerify = DefineComponent<SlideVerifyProps, RawBindings>

  const SlideVerifyComponent: SlideVerify

  export default SlideVerifyComponent

  export type SlideVerifyInstance = ComponentPublicInstance<
    SlideVerifyProps,
    RawBindings,
    SlideVerifyEmits
  >
}
