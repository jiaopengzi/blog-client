/*
 * FilePath    : blog-client\src\customElementsMount\PayContent.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容挂载
 */

import { createApp, h } from "vue"

import PayContent, { ContentPayType, type PayContentProps } from "@/components/common/pay-content"

import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

/**
 * @description: 挂载付费内容组件到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 */
export const mountPayContentOnCustomElements = (
    container: HTMLElement,
    childElement: typeof BaseCustomElement,
    content_pay_type: ContentPayType,

    // **注意这里函数的写法必须是on开头的后续跟驼峰格式的事件名**
    emits: {
        onPayVip?: (val: ContentPayType) => void // 付费阅读事件
        onPaySingle?: (val: ContentPayType) => void // 付费下载事件
    } = {},
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return
    componentContainers.forEach((el) => {
        const content = el.innerHTML

        const props: PayContentProps = {
            content_pay_type,
            markdown: content,
        }

        // 自动将 emits 的事件转为组件事件(示例: onPayVip -> onPay-vip)
        const vueEmits = Object.entries(emits).reduce(
            (acc, [key, fn]) => {
                if (typeof fn === "function" && key.startsWith("on")) {
                    // 先从 onPayVip 转换到 Pay-vip
                    let vueEmitName = key
                        .slice(2) // 去掉 on 前缀
                        .replace(/([A-Z])/g, "-$1") // 将驼峰转为短横线格式
                        .toLowerCase() // 转为小写
                        .replace(/^-/, "") // 去除开头的短横线
                        .replace(/^\w/, (c) => c.toUpperCase()) // 首字母大写
                    vueEmitName = `on${vueEmitName}`
                    acc[vueEmitName] = fn // 将事件名转换为 Vue 事件格式
                }
                return acc
            },
            {} as Record<string, (val: ContentPayType) => void>,
        )

        const app = createApp({
            render() {
                return h(PayContent, {
                    ...props,
                    ...vueEmits, // 将转换后的事件传递给组件
                })
            },
        })

        app.mount(el)
    })
}
