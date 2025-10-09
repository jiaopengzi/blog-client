/*
 * FilePath    : blog-client\src\customElements\base.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义元素基类
 */

import { Attributes } from "./types"

// 自定义元素开放属性
export const CustomElementAttributes: string[] = Object.values(Attributes)

// 自定义元素 参考:https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_custom_elements

// 通用自定义元素基类
export class BaseCustomElement extends HTMLElement {
    constructor() {
        super()
    }

    // 限定属性
    static get observedAttributes() {
        return CustomElementAttributes
    }

    // 当属性变化时被调用
    attributeChangedCallback(name: string) {
        if (!BaseCustomElement.observedAttributes.includes(name)) {
            console.warn(`Attribute "${name}" is not allowed.`)
            this.removeAttribute(name)
        }
    }
    // // 当属性变化时被调用
    // attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    //     if (!BaseCustomElement.observedAttributes.includes(name)) {
    //         console.warn(`Attribute "${name}" is not allowed.`)
    //         this.removeAttribute(name)
    //     } else {
    //         console.info(`Attribute "${name}" changed from ${oldValue} to ${newValue}`)
    //     }
    // }
}
