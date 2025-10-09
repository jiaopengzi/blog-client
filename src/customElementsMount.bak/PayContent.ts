/*
 * FilePath    : blog-client\src\customElementsMount\PayContent.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容挂载
 */

import { type ComputedRef, createApp, h } from "vue"

import PayContent, { ContentPayType, type PayContentProps } from "@/components/common/pay-content"

import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"
import { convertEmits } from "./utils"

/**
 * @description: 挂载付费内容组件到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 * @param contentPayType 付费内容类型
 * @param emits 组件事件
 * @param isPaid 是否付费阅读
 * @param price 价格
 */
export const mountPayContentOnCustomElements = (
    container: HTMLElement,
    childElement: typeof BaseCustomElement,
    contentPayType: ContentPayType,
    createOrderLoading: ComputedRef<boolean>,

    // **注意这里函数的写法必须是on开头的后续跟驼峰格式的事件名**
    emits: {
        onPayVip?: (val: ContentPayType) => void // 付费阅读事件
        onPaySingle?: (val: ContentPayType) => void // 付费下载事件
    } = {},

    isPaid?: ComputedRef<boolean>, // 是否已经付费
    price?: ComputedRef<string>, // 价格(单位：分)
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return
    componentContainers.forEach((el) => {
        const content = el.innerHTML

        const props: PayContentProps = {
            contentPayType,
            markdown: content,
        }

        // 自动将 emits 的事件转为组件事件(示例: onPayVip -> onPay-vip)
        const vueEmits = convertEmits<ContentPayType>(emits)

        const app = createApp({
            render() {
                return h(PayContent, {
                    ...props,
                    loading: createOrderLoading.value,
                    isPaid: isPaid?.value || false, // 是否已经付费
                    price: price?.value || "0", // 价格(单位：分)
                    ...vueEmits, // 将转换后的事件传递给组件
                })
            },
        })

        app.mount(el)
    })
}
