/**
 * FilePath    : blog-client-dev\src\stores\editor-defaults.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : editor-defaults 工具函数单元测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
    buildPowerBiContent,
    buildWechatCaptchaPrefix,
    clearPowerBiDefaults,
    clearWechatCaptchaDefaults,
    loadPowerBiDefaults,
    loadWechatCaptchaDefaults,
    savePowerBiDefaults,
    saveWechatCaptchaDefaults,
} from "./editor-defaults"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

describe("savePowerBiDefaults + loadPowerBiDefaults", () => {
    it("保存后可以正确读取 PowerBi 默认值(round-trip)", () => {
        const defaults = { maskcolor: "#abcdef" }
        savePowerBiDefaults(defaults)
        const loaded = loadPowerBiDefaults()
        expect(loaded).toEqual(defaults)
    })

    it("localStorage 中无对应键时 loadPowerBiDefaults 返回 null", () => {
        const result = loadPowerBiDefaults()
        expect(result).toBeNull()
    })
})

describe("saveWechatCaptchaDefaults + loadWechatCaptchaDefaults", () => {
    it("保存后可以正确读取 WechatCaptcha 默认值(round-trip)", () => {
        const defaults = { name: "焦棚子", codeurl: "https://example.com/qr.png" }
        saveWechatCaptchaDefaults(defaults)
        const loaded = loadWechatCaptchaDefaults()
        expect(loaded).toEqual(defaults)
    })
})

describe("buildPowerBiContent", () => {
    it("传入非 null defaults 时使用 maskcolor 构建内容", () => {
        const result = buildPowerBiContent({ maskcolor: "#ff0000" })
        expect(result).toBe('<power-bi src="" maskcolor="#ff0000"></power-bi>')
    })

    it("传入 null 时返回静态回退内容", () => {
        const result = buildPowerBiContent(null)
        expect(result).toBe('<power-bi src="" maskcolor=""></power-bi>')
    })
})

describe("buildWechatCaptchaPrefix", () => {
    it("传入非 null defaults 时使用 name 和 codeurl 构建前缀", () => {
        const result = buildWechatCaptchaPrefix({ name: "焦棚子", codeurl: "https://example.com/qr.png" })
        expect(result).toBe(
            '\n<wechat-captcha name="焦棚子" codeurl="https://example.com/qr.png" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n',
        )
    })

    it("传入 null 时返回静态回退前缀", () => {
        const result = buildWechatCaptchaPrefix(null)
        expect(result).toBe(
            '\n<wechat-captcha name="您的公众号名称" codeurl="您的公众号二维码链接" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n',
        )
    })
})

describe("clearPowerBiDefaults", () => {
    it("调用后 loadPowerBiDefaults 返回 null", () => {
        const defaults = { maskcolor: "#abcdef" }
        savePowerBiDefaults(defaults)
        clearPowerBiDefaults()
        const loaded = loadPowerBiDefaults()
        expect(loaded).toBeNull()
    })

    it("clear 后 buildPowerBiContent 回退到内置模板", () => {
        const defaults = { maskcolor: "#abcdef" }
        savePowerBiDefaults(defaults)
        clearPowerBiDefaults()
        const result = buildPowerBiContent(loadPowerBiDefaults())
        expect(result).toBe('<power-bi src="" maskcolor=""></power-bi>')
    })
})

describe("clearWechatCaptchaDefaults", () => {
    it("调用后 loadWechatCaptchaDefaults 返回 null", () => {
        const defaults = { name: "焦棚子", codeurl: "https://example.com/qr.png" }
        saveWechatCaptchaDefaults(defaults)
        clearWechatCaptchaDefaults()
        const loaded = loadWechatCaptchaDefaults()
        expect(loaded).toBeNull()
    })

    it("clear 后 buildWechatCaptchaPrefix 回退到内置模板", () => {
        const defaults = { name: "焦棚子", codeurl: "https://example.com/qr.png" }
        saveWechatCaptchaDefaults(defaults)
        clearWechatCaptchaDefaults()
        const result = buildWechatCaptchaPrefix(loadWechatCaptchaDefaults())
        expect(result).toBe(
            '\n<wechat-captcha name="您的公众号名称" codeurl="您的公众号二维码链接" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n',
        )
    })
})
