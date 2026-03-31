/**
 * FilePath    : blog-client\src\components\common\wechat-captcha\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 微信验证码组件单元测试
 */

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"

import { MessageUtil } from "@/utils/message"

vi.mock("@/customElementsMount/VideoPlayer", () => ({
    mountVideoPlayerOnCustomElements: vi.fn(),
}))

import WechatCaptcha from "./index.vue"

const mountComponent = (hiddenHtml: string = "<p>隐藏内容</p>", postId: string = "post-1") => {
    return mount(WechatCaptcha, {
        props: {
            name: "焦棚子",
            codeurl: "https://example.com/qrcode.png",
            verifyKey: "1120",
            reply: "demo148",
            hiddenHtml,
            postId,
        },
    })
}

describe("WechatCaptcha", () => {
    afterEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it("验证码错误时提示重新输入", async () => {
        const wrapper = mountComponent()
        const errorSpy = vi.spyOn(MessageUtil, "error").mockImplementation(() => {})

        await wrapper.find(".wechat-captcha-input").setValue("wrong")
        await wrapper.find(".wechat-captcha-btn").trigger("click")

        expect(errorSpy).toHaveBeenCalledTimes(1)
        expect(wrapper.find(".wechat-captcha-content").exists()).toBe(false)
    })

    it("验证码正确时显示隐藏内容并缓存", async () => {
        const wrapper = mountComponent()

        await wrapper.find(".wechat-captcha-input").setValue("1120")
        await wrapper.find(".wechat-captcha-btn").trigger("click")
        await wrapper.vm.$nextTick()

        expect(wrapper.html()).toContain("隐藏内容")
        expect(localStorage.getItem("wechat-captcha:post-1")).toBe("verified")
    })

    it("已缓存验证状态时直接显示隐藏内容", async () => {
        localStorage.setItem("wechat-captcha:post-1", "verified")
        const wrapper = mountComponent()
        await wrapper.vm.$nextTick()

        expect(wrapper.html()).toContain("隐藏内容")
        expect(wrapper.find(".wechat-captcha-input").exists()).toBe(false)
    })

    it("相同验证码在不同文章之间不会共用缓存", async () => {
        localStorage.setItem("wechat-captcha:post-1", "verified")

        const wrapper = mountComponent("<p>隐藏内容</p>", "post-2")
        await wrapper.vm.$nextTick()

        expect(wrapper.find(".wechat-captcha-input").exists()).toBe(true)
        expect(wrapper.find(".wechat-captcha-content").exists()).toBe(false)
    })

    it("缺少文章 ID 时不会写入验证码缓存", async () => {
        const wrapper = mountComponent("<p>隐藏内容</p>", "")

        await wrapper.find(".wechat-captcha-input").setValue("1120")
        await wrapper.find(".wechat-captcha-btn").trigger("click")
        await wrapper.vm.$nextTick()

        expect(wrapper.html()).toContain("隐藏内容")
        expect(localStorage.length).toBe(0)
    })

    it("隐藏内容中的 video-player 组件在验证后仍能挂载", async () => {
        const wrapper = mountComponent('<video-player video-type="hls" id="m-1"></video-player>')

        await wrapper.find(".wechat-captcha-input").setValue("1120")
        await wrapper.find(".wechat-captcha-btn").trigger("click")
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        expect(wrapper.find("video-player").exists()).toBe(true)
    })
})
