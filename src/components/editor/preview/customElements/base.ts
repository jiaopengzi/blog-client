/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-23 18:01:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-02 15:48:34
 * @FilePath     : \blog-client\src\components\editor\preview\customElements\base.ts
 * @Description  : 自定义元素基类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 自定义元素开放属性
export const CustomElementAttributes: string[] = ["id", "class", "video-type", "src"]

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
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (!BaseCustomElement.observedAttributes.includes(name)) {
            console.warn(`Attribute "${name}" is not allowed.`)
            this.removeAttribute(name)
        } else {
            console.info(`Attribute "${name}" changed from ${oldValue} to ${newValue}`)
        }
    }
}
