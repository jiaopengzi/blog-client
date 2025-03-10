/**
 * @FilePath     : \blog-client\types\clipboard.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 粘贴板类型定义
 */

declare module "clipboard" {
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
        on(type: "success" | "error", listener: (e: ClipboardEvent) => void): this
        destroy(): void
    }

    const Clipboard: ClipboardStatic

    export default Clipboard
}
