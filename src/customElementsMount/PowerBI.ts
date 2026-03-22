/*
 * FilePath    : blog-client\src\customElementsMount\PowerBI.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 挂载 Power BI 到自定义元素
 */

import { createApp, h } from "vue"

import PowerBiComponent from "@/components/common/power-bi"

import { Attributes, Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

export interface PowerBIState {
    src: string
}

export const getPowerBIState = (el: Element): PowerBIState => {
    const src = el.getAttribute(Attributes.Src) || ""
    return { src }
}

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
                return h(PowerBiComponent, { src: state.src })
            },
        })

        app.mount(host)
    })
}
