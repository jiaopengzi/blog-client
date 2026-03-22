/*
 * FilePath    : blog-client\src\customElements\base.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义元素基类
 */

// 自定义元素属性
export enum Attributes {
    Id = "id", // 元素 id
    Class = "class", // 元素 class
    Name = "name", // 微信验证码等需要的名称
    CodeUrl = "codeurl", // 微信验证码等需要的验证码
    Key = "key", // 微信验证码等需要的 key
    Reply = "reply", // 微信验证码等需要的回复内容
    VideoType = "video-type", // 视频类型
    Poster = "poster", // 视频封面
    Src = "src", // 视频地址
    MaskColor = "maskcolor",
    Title = "title", // 标题
    Description = "description", // 描述
}

// 自定义元素开放属性
export const CustomElementAttributes: string[] = Object.values(Attributes)

// 自定义元素 参考:https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_custom_elements

// 通用自定义元素基类
export class BaseCustomElement extends HTMLElement {
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
