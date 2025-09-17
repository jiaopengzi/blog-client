/*
 * FilePath    : blog-client\src\customElementsMount\PayKey.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥
 */

import { type ComputedRef, createApp, h } from "vue"

import { type Product as KeyRes } from "@/api/order/create"
import PayKey from "@/components/common/pay-key"

import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"
import { convertEmits } from "./utils"

/**
 * @description: 挂载付费账号密钥组件到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 * @param emits 组件事件
 */
export const mountPayKeyOnCustomElements = (
    container: HTMLElement,
    childElement: typeof BaseCustomElement,
    createOrderLoading: ComputedRef<boolean>,

    // **注意这里函数的写法必须是on开头的后续跟驼峰格式的事件名**
    emits: {
        onPayKey?: (val: KeyRes) => void // 付费账号密钥事件
    } = {},
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return
    componentContainers.forEach((el) => {
        // 自动将 emits 的事件转为组件事件(示例: onClick -> onClick)
        const vueEmits = convertEmits<KeyRes>(emits)
        const productId = el.getAttribute("id") || "" // 产品关联ID
        const title = el.getAttribute("title") || "账号密钥" // 自定义标题
        const description = el.getAttribute("description") || "" // 自定义说明

        const app = createApp({
            render() {
                return h(PayKey, {
                    productId,
                    title,
                    description,
                    loading: createOrderLoading.value,
                    ...vueEmits, // 将转换后的事件传递给组件
                })
            },
        })

        app.mount(el)
    })
}
