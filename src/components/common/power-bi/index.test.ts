/**
 * FilePath    : blog-client-dev\src\components\common\power-bi\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : PowerBI 组件单元测试
 */

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"

import PowerBi from "./index"

const requestFullscreenMock = vi.fn()

const setFullscreenElement = (value: Element | null) => {
    Object.defineProperty(document, "fullscreenElement", {
        configurable: true,
        value,
    })
}

const mountComponent = (src?: string, maskcolor?: string) => {
    return mount(PowerBi, {
        props: {
            src,
            maskcolor,
        },
    })
}

describe("PowerBi", () => {
    afterEach(() => {
        setFullscreenElement(null)
        requestFullscreenMock.mockReset()
        vi.restoreAllMocks()
    })

    it("未提供 src 时显示占位提示", () => {
        const wrapper = mountComponent("")

        expect(wrapper.text()).toContain("未提供 src")
        expect(wrapper.find("iframe").exists()).toBe(false)
    })

    it("非法 Power BI 地址时显示友好错误提示", () => {
        const wrapper = mountComponent("错误url")

        expect(wrapper.text()).toContain("不是有效的 Power BI 地址")
        expect(wrapper.find("iframe").exists()).toBe(false)
    })

    it("缺少协议的地址时显示友好错误提示", () => {
        const wrapper = mountComponent("app.powerbi.cn/view?r=123")

        expect(wrapper.text()).toContain("不是有效的 Power BI 地址")
        expect(wrapper.find("iframe").exists()).toBe(false)
    })

    it("合法 Power BI 地址时渲染 iframe 和遮罩层", () => {
        const wrapper = mountComponent("https://app.powerbi.cn/view?r=123", "#ffffff")

        expect(wrapper.find("iframe.power-bi-iframe").attributes("src")).toBe("https://app.powerbi.cn/view?r=123")
        expect(wrapper.find("iframe.power-bi-iframe").attributes("tabindex")).toBe("-1")
        expect(wrapper.find("button.power-bi-fullscreen-btn").attributes("type")).toBe("button")
        expect(wrapper.find(".power-bi-mask").exists()).toBe(true)
        expect(wrapper.find(".power-bi-mask").attributes("style")).toContain("background-color: rgb(255, 255, 255)")
        expect(wrapper.text()).not.toContain("不是有效的 Power BI 地址")
    })

    it("maskcolor 属性不存在时不显示遮罩", () => {
        const wrapper = mountComponent("https://app.powerbi.cn/view?r=123")

        expect(wrapper.find(".power-bi-mask").exists()).toBe(false)
    })

    it("maskcolor 为空时不显示遮罩", () => {
        const wrapper = mountComponent("https://app.powerbi.cn/view?r=123", "")

        expect(wrapper.find(".power-bi-mask").exists()).toBe(false)
    })

    it("进入全屏后隐藏全屏按钮", async () => {
        const wrapper = mountComponent("https://app.powerbi.cn/view?r=123", "#ffffff")
        const container = wrapper.find(".power-bi-card").element as HTMLElement & { requestFullscreen?: () => Promise<void> }
        container.requestFullscreen = requestFullscreenMock.mockResolvedValue(undefined)

        await wrapper.find(".power-bi-fullscreen-btn").trigger("click")

        expect(requestFullscreenMock).toHaveBeenCalledTimes(1)

        setFullscreenElement(container)
        document.dispatchEvent(new Event("fullscreenchange"))
        await wrapper.vm.$nextTick()

        expect(wrapper.find(".power-bi-fullscreen-btn").exists()).toBe(false)
    })
})
