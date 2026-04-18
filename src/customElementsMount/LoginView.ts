/*
 * FilePath    : blog-client\src\customElementsMount\LoginView.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 登录查看组件状态提取与挂载
 */

import { createApp, h } from "vue"
import { createPinia } from "pinia"

import LoginView from "@/components/common/login-view"
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

import { Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

export interface LoginViewState {
    hiddenHtml: string
}

export const getLoginViewState = (el: Element): LoginViewState => {
    return {
        hiddenHtml: (el as HTMLElement).innerHTML,
    }
}

export const mountLoginViewOnCustomElements = (container: HTMLElement, tagName: Names, postId: string = "", isAdminVideo: boolean = false) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)

    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const state = getLoginViewState(el)
        const app = createApp({
            render() {
                return h(LoginView, {
                    hiddenHtml: state.hiddenHtml,
                    postId,
                    isAdminVideo,
                })
            },
        })

        app.use(createPinia())
        app.directive("stable-html", stableHtmlDirective)
        app.mount(el)
    })
}
