/**
 * FilePath    : blog-client\src\components\player\components\watermark\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : VideoWatermark 组件测试 (水印内容变化重渲染)
 */

import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import { describe, expect, it } from "vitest"

import type { LogoWatermark, TextWatermark } from "@/components/player/types"

import VideoWatermark from "../index.vue"

// 水印元素是命令式 appendChild 创建的, 不在 Vue 虚拟树内, 统一经 DOM 查询断言
const getTextSpans = (wrapper: ReturnType<typeof mount>) => Array.from(wrapper.element.querySelectorAll<HTMLSpanElement>(".watermark-container > span"))

const getLogoImgs = (wrapper: ReturnType<typeof mount>) => Array.from(wrapper.element.querySelectorAll<HTMLImageElement>(".watermark-container > img"))

const mountComponent = (props: { textWatermark?: TextWatermark; logoWatermark?: LogoWatermark } = {}) => {
    return mount(VideoWatermark, { props })
}

describe("VideoWatermark 组件", () => {
    it("挂载时渲染文字水印与 logo 水印", async () => {
        const wrapper = mountComponent({ textWatermark: { content: "默认水印" }, logoWatermark: { imgUrl: "https://example.com/logo.png" } })
        await nextTick()

        expect(getTextSpans(wrapper)[0]?.textContent).toBe("默认水印")
        expect(getLogoImgs(wrapper)[0]?.getAttribute("src")).toBe("https://example.com/logo.png")
        wrapper.unmount()
    })

    it("文字水印内容变化后重渲染 (bug01 260916-07: 刷新后登录态水印恢复用户名)", async () => {
        const wrapper = mountComponent({ textWatermark: { content: "默认水印" } })
        await nextTick()

        // 模拟 Nuxt 刷新时序: 挂载时为默认水印, 登录态恢复后 content 变为用户名
        await wrapper.setProps({ textWatermark: { content: "jiaopengzi" } })
        await nextTick()

        const spans = getTextSpans(wrapper)
        expect(spans).toHaveLength(1)
        expect(spans[0]?.textContent).toBe("jiaopengzi")
        wrapper.unmount()
    })

    it("文字水印内容变空后移除水印且不被 MutationObserver 复活", async () => {
        const wrapper = mountComponent({ textWatermark: { content: "默认水印", style: { color: "red" } } })
        await nextTick()
        expect(getTextSpans(wrapper)).toHaveLength(1)

        await wrapper.setProps({ textWatermark: { content: "" } })
        await nextTick()
        // 等待 MutationObserver 微任务与 stopObservation 复位宏任务全部走完
        await new Promise((resolve) => setTimeout(resolve, 20))

        expect(getTextSpans(wrapper)).toHaveLength(0)
        wrapper.unmount()
    })

    it("文字水印内容从空变为有值时创建水印", async () => {
        const wrapper = mountComponent({ textWatermark: { content: "" } })
        await nextTick()
        expect(getTextSpans(wrapper)).toHaveLength(0)

        await wrapper.setProps({ textWatermark: { content: "用户名" } })
        await nextTick()

        const spans = getTextSpans(wrapper)
        expect(spans).toHaveLength(1)
        expect(spans[0]?.textContent).toBe("用户名")
        wrapper.unmount()
    })

    it("多次内容变化不叠加水印元素", async () => {
        const wrapper = mountComponent({ textWatermark: { content: "a", style: { color: "red" } } })
        await nextTick()

        await wrapper.setProps({ textWatermark: { content: "b", style: { color: "red" } } })
        await nextTick()
        await wrapper.setProps({ textWatermark: { content: "c", style: { color: "red" } } })
        await nextTick()

        const spans = getTextSpans(wrapper)
        expect(spans).toHaveLength(1)
        expect(spans[0]?.textContent).toBe("c")
        wrapper.unmount()
    })

    it("logo 水印地址变化后重渲染", async () => {
        const wrapper = mountComponent({ logoWatermark: { imgUrl: "https://example.com/a.png" } })
        await nextTick()
        expect(getLogoImgs(wrapper)).toHaveLength(1)

        await wrapper.setProps({ logoWatermark: { imgUrl: "https://example.com/b.png" } })
        await nextTick()

        const imgs = getLogoImgs(wrapper)
        expect(imgs).toHaveLength(1)
        expect(imgs[0]?.getAttribute("src")).toBe("https://example.com/b.png")
        wrapper.unmount()
    })

    it("logo 水印地址变空后移除", async () => {
        const wrapper = mountComponent({ logoWatermark: { imgUrl: "https://example.com/a.png" } })
        await nextTick()
        expect(getLogoImgs(wrapper)).toHaveLength(1)

        await wrapper.setProps({ logoWatermark: { imgUrl: "" } })
        await new Promise((resolve) => setTimeout(resolve, 20))

        expect(getLogoImgs(wrapper)).toHaveLength(0)
        wrapper.unmount()
    })
})
