/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-06 15:39:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 11:18:43
 * @FilePath     : \blog-client\types\pkg\clipboard.d.ts
 * @Description  : 粘贴板类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

declare module 'clipboard' {
  export interface ClipboardOptions {
    text?: (trigger: Element) => string
  }

  export interface ClipboardEvent extends Event {
    action: string
    text: string
    trigger: Element
    clearSelection(): void
  }

  export interface ClipboardStatic {
    new (selector: string | Element, options?: ClipboardOptions): ClipboardJS
  }

  export interface ClipboardJS {
    on(type: 'success' | 'error', listener: (e: ClipboardEvent) => void): this
    destroy(): void
  }

  const Clipboard: ClipboardStatic

  export default Clipboard
}
