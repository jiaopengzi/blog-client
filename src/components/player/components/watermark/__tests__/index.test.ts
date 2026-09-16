/**
 * FilePath    : blog-client\src\components\player\components\watermark\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : VideoWatermark 组件测试 (水印内容变化重渲染)
 */

import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import { afterEach, describe, expect, it, vi } from "vitest"

import type { LogoWatermark, TextWatermark } from "@/components/player/types"

import VideoWatermark from "../index.vue"

// 水印元素是命令式 appendChild 创建的, 不在 Vue 虚拟树内, 统一经 DOM 查询断言
const getTextSpans = (wrapper: ReturnType<typeof mount>) => Array.from(wrapper.element.querySelectorAll<HTMLSpanElement>(".watermark-container > span"))

const getLogoImgs = (wrapper: ReturnType<typeof mount>) => Array.from(wrapper.element.querySelectorAll<HTMLImageElement>(".watermark-container > img"))

const mountComponent = (props: { textWatermark?: TextWatermark; logoWatermark?: LogoWatermark } = {}) => {
    // attachTo: 随机定位重试链路校验 watermark.isConnected, 需挂到 document 使元素处于已连接状态
    return mount(VideoWatermark, { props, attachTo: document.body })
}

// happy-dom 不做真实布局, 容器 clientWidth/clientHeight 恒为 0; 用 defineProperty 覆盖实例属性模拟容器尺寸
const mockContainerSize = (wrapper: ReturnType<typeof mount>, width: number, height: number) => {
    const container = wrapper.element
    Object.defineProperty(container, "clientWidth", { configurable: true, get: () => width })
    Object.defineProperty(container, "clientHeight", { configurable: true, get: () => height })
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

    describe("随机定位 (bugfix 260916-07: 刷新后水印恒在左上角)", () => {
        afterEach(() => {
            vi.restoreAllMocks()
        })

        it("容器尺寸就绪时按随机值定位", async () => {
            const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5)

            // 挂载时 happy-dom 容器为 0x0 (随机定位进入 rAF 重试); 就绪尺寸后变更 content 触发重渲染重新定位
            const style = { color: "blue", fontSize: "12px" } as TextWatermark["style"]
            const wrapper = mountComponent({ textWatermark: { content: "默认水印", style } })
            mockContainerSize(wrapper, 720, 405)
            await wrapper.setProps({ textWatermark: { content: "jiaopengzi", style } })
            await nextTick()

            const span = getTextSpans(wrapper)[0]
            expect(span?.style.left).toBe("360px") // 0.5 * (720 - 0)
            expect(span?.style.top).toBe("202.5px") // 0.5 * (405 - 0)
            expect(randomSpy).toHaveBeenCalled()
            wrapper.unmount()
        })

        it("容器尺寸未就绪时不写入 (0,0) 定位且不污染共享 style 对象", async () => {
            const style: TextWatermark["style"] = { color: "blue", fontSize: "12px" }
            const wrapper = mountComponent({ textWatermark: { content: "默认水印", style } })
            await nextTick()

            const span = getTextSpans(wrapper)[0]
            expect(span).toBeTruthy()
            expect(span?.style.left).toBe("")
            expect(span?.style.top).toBe("")
            expect("left" in (style ?? {})).toBe(false)
            // 定位完成前先隐藏, 首次可见即为随机位置
            expect(span?.style.visibility).toBe("hidden")
            wrapper.unmount()
        })

        it("容器尺寸经 rAF 重试就绪后完成随机定位", async () => {
            vi.useFakeTimers({ toFake: ["requestAnimationFrame", "setTimeout", "setInterval"] })
            const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5)

            try {
                // 挂载时容器 0x0 (水合早期), 随机定位进入 rAF 重试
                const style = { color: "blue", fontSize: "12px" } as TextWatermark["style"]
                const wrapper = mountComponent({ textWatermark: { content: "jiaopengzi", style } })
                await nextTick()

                const span = getTextSpans(wrapper)[0]
                expect(span?.style.left).toBe("")

                // 布局就绪 (容器 720x405), 推进一帧 rAF 后完成定位
                mockContainerSize(wrapper, 720, 405)
                vi.advanceTimersByTime(16)

                expect(span?.style.left).toBe("360px")
                expect(span?.style.top).toBe("202.5px")
                // 定位成功后恢复显示
                expect(span?.style.visibility).toBe("")
                expect(randomSpy).toHaveBeenCalled()
                wrapper.unmount()
            } finally {
                vi.useRealTimers()
            }
        })
    })
})
