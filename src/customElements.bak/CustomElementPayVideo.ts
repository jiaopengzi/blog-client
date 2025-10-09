/*
 * FilePath    : blog-client\src\customElements\CustomElementPayVideo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费视频
 */

import { BaseCustomElement } from "./base"
import { Names } from "./types"

/**
 * @description:自定义元素 PayVideo 付费视频模块用于挂载 vue 组件
 */
export class CustomElementPayVideo extends BaseCustomElement {
    constructor() {
        super()
    }
}

// 注册自定义元素
customElements.define(Names.PayVideo, CustomElementPayVideo)
