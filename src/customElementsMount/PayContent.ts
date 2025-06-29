/*
 * FilePath    : blog-client\src\customElementsMount\PayContent.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容挂载
 */

import { createApp, h } from "vue"

import PayContent, { type PayContentProps, PayType } from "@/components/common/pay-content"

import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

/**
 * @description: 挂载付费内容组件到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 */
export const mountPayContentOnCustomElements = (container: HTMLElement, childElement: typeof BaseCustomElement, payType: PayType) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return
    console.log("============>componentContainers", componentContainers)
    componentContainers.forEach((el) => {
        // 拿到 el 元素的内容
        const content = el.innerHTML

        const props: PayContentProps = {
            payType,
            markdown: content,
        }

        const app = createApp({
            render() {
                return h(PayContent, props)
            },
        })

        app.mount(el)
    })
}
