/*
 * FilePath    : blog-client\src\customElements\CustomElementPayRead.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费阅读
 */

import { BaseCustomElement } from "./base"
import { Names } from "./types"

/**
 * @description:自定义元素 PayRead 付费阅读模块用于挂载 vue 组件
 */
export class CustomElementPayRead extends BaseCustomElement {
    constructor() {
        super()
    }
}

// 注册自定义元素
customElements.define(Names.PayRead, CustomElementPayRead)
