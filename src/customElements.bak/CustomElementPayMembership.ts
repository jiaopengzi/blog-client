/*
 * FilePath    : blog-client\src\customElements\CustomElementPayMembership.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员付费
 */

import { BaseCustomElement } from "./base"
import { Names } from "./types"

/**
 * @description:自定义元素 PayMembership 付费会员模块用于挂载 vue 组件
 */
export class CustomElementPayMembership extends BaseCustomElement {
    constructor() {
        super()
    }
}

// 注册自定义元素
customElements.define(Names.PayMembership, CustomElementPayMembership)
