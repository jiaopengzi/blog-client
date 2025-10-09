/*
 * FilePath    : blog-client\src\customElements\CustomElementPayKey.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥
 */

import { BaseCustomElement } from "./base"
import { Names } from "./types"

/**
 * @description:自定义元素 PayKey 付费账号密钥模块用于挂载 vue 组件
 */
export class CustomElementPayKey extends BaseCustomElement {
    constructor() {
        super()
    }
}

// 注册自定义元素
customElements.define(Names.PayKey, CustomElementPayKey)
