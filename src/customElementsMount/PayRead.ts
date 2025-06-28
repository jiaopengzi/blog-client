/*
 * FilePath    : blog-client\src\customElementsMount\PayRead.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费阅读
 */

import { createApp, h } from "vue"

import PayRead from "@/components/common/pay-read"

import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

/**
 * @description: 挂载付费阅读组件到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 */
export const mountPayReadOnCustomElements = (container: HTMLElement, childElement: typeof BaseCustomElement) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return

    componentContainers.forEach((el) => {
        // 拿到 el 元素的内容
        const content = el.innerHTML

        const app = createApp({
            render() {
                return h(PayRead, { markdown: content })
            },
        })

        app.mount(el)
    })
}
