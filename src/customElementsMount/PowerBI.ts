/*
 * FilePath    : blog-client\src\customElementsMount\PowerBI.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 挂载 Power BI 到自定义元素
 */

import { createApp, h } from "vue"

import PowerBi from "@/components/common/power-bi"

import { Attributes, Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

// 定义 PowerBI 组件状态接口
export interface PowerBIState {
    src: string
    maskcolor?: string
}

// 从元素属性获取 PowerBI 组件状态
export const getPowerBIState = (el: Element): PowerBIState => {
    const src = el.getAttribute(Attributes.Src) || ""
    const maskcolor = el.getAttribute(Attributes.MaskColor) ?? undefined
    return { src, maskcolor }
}

// 挂载 PowerBI 组件到指定容器内的所有自定义元素
export const mountPowerBIOnCustomElements = (container: HTMLElement, tagName: Names) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)

    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const state = getPowerBIState(el)
        const host = el as HTMLElement

        if (!host.style.display) {
            host.style.display = "block"
        }

        const app = createApp({
            render() {
                return h(PowerBi, { src: state.src, maskcolor: state.maskcolor })
            },
        })

        app.mount(host)
    })
}
