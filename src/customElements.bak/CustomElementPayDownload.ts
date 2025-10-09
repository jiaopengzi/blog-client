/*
 * FilePath    : blog-client\src\customElements\CustomElementPayDownload.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费下载
 */

import { BaseCustomElement } from "./base"
import { Names } from "./types"

/**
 * @description:自定义元素 PayDownload 付费下载模块用于挂载 vue 组件
 */
export class CustomElementPayDownload extends BaseCustomElement {
    constructor() {
        super()
    }
}

// 注册自定义元素
customElements.define(Names.PayDownload, CustomElementPayDownload)
