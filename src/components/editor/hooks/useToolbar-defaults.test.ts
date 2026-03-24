/**
 * FilePath    : blog-client\src\components\editor\hooks\useToolbar-defaults.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : useToolbar 工具栏插入路径默认值集成测试
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
} from "@/stores/editor-defaults"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

describe("useToolbar 工具栏插入路径默认值集成测试", () => {
    it("有 PowerBi 本地默认值时 buildPowerBiContent 返回含保存 maskcolor 的内容", () => {
        savePowerBiDefaults({ maskcolor: "#saved" })
        const defaults = loadPowerBiDefaults()
        const content = buildPowerBiContent(defaults)
        expect(content).toContain('maskcolor="#saved"')
    })

    it("无 PowerBi 本地默认值时 buildPowerBiContent 返回静态回退内容", () => {
        const defaults = loadPowerBiDefaults()
        const content = buildPowerBiContent(defaults)
        expect(content).toBe('<power-bi src="" maskcolor=""></power-bi>')
    })

    it("有 WechatCaptcha 本地默认值时 buildWechatCaptchaPrefix 返回含保存值的前缀", () => {
        saveWechatCaptchaDefaults({ name: "saved-name", codeurl: "saved-url" })
        const defaults = loadWechatCaptchaDefaults()
        const prefix = buildWechatCaptchaPrefix(defaults)
        expect(prefix).toContain('name="saved-name"')
        expect(prefix).toContain('codeurl="saved-url"')
    })

    it("无 WechatCaptcha 本地默认值时 buildWechatCaptchaPrefix 返回静态回退前缀", () => {
        const defaults = loadWechatCaptchaDefaults()
        const prefix = buildWechatCaptchaPrefix(defaults)
        expect(prefix).toContain('name="您的公众号名称"')
        expect(prefix).toContain('codeurl="您的公众号二维码链接"')
    })

    it("clearPowerBiDefaults 后 buildPowerBiContent 回退到静态内容(模拟工具栏插入读取 localStorage 的场景)", () => {
        // 先保存一个自定义值, 然后清除, 模拟用户在设置面板点击「清除」后下次点击工具栏按钮的路径
        savePowerBiDefaults({ maskcolor: "#to-be-cleared" })
        clearPowerBiDefaults()
        const defaults = loadPowerBiDefaults()
        const content = buildPowerBiContent(defaults)
        expect(content).toBe('<power-bi src="" maskcolor=""></power-bi>')
    })

    it("clearWechatCaptchaDefaults 后 buildWechatCaptchaPrefix 回退到静态前缀(模拟工具栏插入读取 localStorage 的场景)", () => {
        // 先保存一个自定义值, 然后清除, 模拟用户在设置面板点击「清除」后下次点击工具栏按钮的路径
        saveWechatCaptchaDefaults({ name: "to-be-cleared", codeurl: "to-be-cleared-url" })
        clearWechatCaptchaDefaults()
        const defaults = loadWechatCaptchaDefaults()
        const prefix = buildWechatCaptchaPrefix(defaults)
        expect(prefix).toContain('name="您的公众号名称"')
        expect(prefix).toContain('codeurl="您的公众号二维码链接"')
    })
})
