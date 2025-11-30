/*
 * FilePath    : blog-client\src\customElementsMount\PayKey.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥
 */

import { type ComputedRef, createApp, h } from "vue"

import { type Product as KeyRes } from "@/api/order/create"
import PayKey, { type PayKeyProps } from "@/components/common/pay-key"

import { Attributes, Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"
import { convertEmits } from "./utils"

// 通过自定义元素获取付费账号密钥状态
export const getPayKeyState = (el: Element): { elTarget: Element | null; state: PayKeyProps } => {
    let elTarget: Element | null = null
    let state: PayKeyProps = {} as PayKeyProps

    if (!el) return { elTarget, state }

    const productId = el.getAttribute(Attributes.Id) || "" // 产品关联ID
    const title = el.getAttribute(Attributes.Title) || "账号密钥" // 自定义标题
    const description = el.getAttribute(Attributes.Description) || "" // 自定义说明

    elTarget = el
    state = {
        productId,
        title,
        description,
    }

    return { elTarget, state }
}

/**
 * @description: 挂载付费账号密钥组件到自定义元素
 * @param container 自定义元素父容器
 * @param tagName 自定义元素标签名
 * @param createOrderLoading 创建订单加载状态
 * @param emits 组件事件
 */
export const mountPayKeyOnCustomElements = (
    container: HTMLElement,
    tagName: Names,
    createOrderLoading: ComputedRef<boolean>,

    // **注意这里函数的写法必须是on开头的后续跟驼峰格式的事件名**
    emits: {
        onPayKey?: (val: KeyRes) => void // 付费账号密钥事件
    } = {},
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)

    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const { elTarget, state } = getPayKeyState(el)
        if (!elTarget) return

        const vueEmits = convertEmits<KeyRes>(emits)
        const app = createApp({
            render() {
                return h(PayKey, {
                    productId: state.productId,
                    title: state.title,
                    description: state.description,
                    loading: createOrderLoading.value,
                    ...vueEmits, // 将转换后的事件传递给组件
                })
            },
        })

        app.mount(elTarget)
    })
}
