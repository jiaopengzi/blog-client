/*
 * FilePath    : blog-client\src\customElementsMount\WechatCaptcha.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 微信验证码组件状态提取与挂载
 */

import { createApp, h } from "vue"

import WechatCaptcha from "@/components/common/wechat-captcha"

import { Attributes, Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

export interface WechatCaptchaState {
    name: string
    codeurl: string
    verifyKey: string
    reply: string
    hiddenHtml: string
}

export const getWechatCaptchaState = (el: Element): WechatCaptchaState => {
    return {
        name: el.getAttribute(Attributes.Name) || "",
        codeurl: el.getAttribute(Attributes.CodeUrl) || "",
        verifyKey: el.getAttribute(Attributes.Key) || "",
        reply: el.getAttribute(Attributes.Reply) || "",
        hiddenHtml: (el as HTMLElement).innerHTML,
    }
}

export const mountWechatCaptchaOnCustomElements = (container: HTMLElement, tagName: Names) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)

    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const state = getWechatCaptchaState(el)
        const app = createApp({
            render() {
                return h(WechatCaptcha, {
                    name: state.name,
                    codeurl: state.codeurl,
                    verifyKey: state.verifyKey,
                    reply: state.reply,
                    hiddenHtml: state.hiddenHtml,
                })
            },
        })

        app.mount(el)
    })
}
