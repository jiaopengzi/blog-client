/**
 * FilePath    : blog-client\src\stores\editor-defaults.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : editor-defaults 工具函数单元测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
    DEFAULT_VIM_IME_PORT,
    DEFAULT_VIM_MAPPINGS,
    buildVimMappingText,
    buildPowerBiContent,
    buildWechatCaptchaPrefix,
    clearVimDefaults,
    clearPowerBiDefaults,
    clearWechatCaptchaDefaults,
    getDefaultVimDefaults,
    loadVimDefaults,
    loadPowerBiDefaults,
    loadWechatCaptchaDefaults,
    parseVimMappingText,
    saveVimDefaults,
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

describe("saveVimDefaults + loadVimDefaults", () => {
    it("保存后可以正确读取 Vim 默认值(round-trip)", () => {
        const defaults = {
            enabled: true,
            mappings: [
                { lhs: "yy", rhs: '"+yy', context: "normal" as const },
                { lhs: "p", rhs: '"+p', context: "normal" as const },
                { lhs: "jj", rhs: "<Esc>", context: "insert" as const },
            ],
            imePort: 18765,
        }

        saveVimDefaults(defaults)
        const loaded = loadVimDefaults()

        expect(loaded).toEqual(defaults)
    })

    it("localStorage 中无对应键时 loadVimDefaults 返回 null", () => {
        const result = loadVimDefaults()
        expect(result).toBeNull()
    })

    it("保存空映射后会保留为空映射, 不会被自动填充", () => {
        saveVimDefaults({ enabled: true, mappings: [], imePort: DEFAULT_VIM_IME_PORT })

        expect(loadVimDefaults()).toEqual({ enabled: true, mappings: [], imePort: DEFAULT_VIM_IME_PORT })
    })

    it("旧配置缺少 imePort 时会回退到默认端口", () => {
        localStorage.setItem(
            "editor_defaults_vim",
            JSON.stringify({
                enabled: true,
                mappings: [{ lhs: "yy", rhs: '"+yy', context: "normal" }],
            }),
        )

        expect(loadVimDefaults()).toEqual({
            enabled: true,
            mappings: [{ lhs: "yy", rhs: '"+yy', context: "normal" }],
            imePort: DEFAULT_VIM_IME_PORT,
        })
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

describe("Vim 映射文本工具", () => {
    it("buildVimMappingText 会将映射数组序列化为多行文本", () => {
        const result = buildVimMappingText(DEFAULT_VIM_MAPPINGS)

        expect(result).toBe("")
    })

    it("buildVimMappingText 会输出括号调用式文本, 并按需带上 context", () => {
        const result = buildVimMappingText([
            { lhs: "yy", rhs: '"+yy', context: "normal" },
            { lhs: "jj", rhs: "<Esc>", context: "insert" },
        ])

        expect(result).toBe('("yy", "\\"+yy", "normal")\n("jj", "<Esc>", "insert")')
    })

    it("parseVimMappingText 支持新的括号调用式格式", () => {
        const result = parseVimMappingText('("yy", "\\"+yy", "normal")\n("jj", "<Esc>", "insert")')

        expect(result).toEqual([
            { lhs: "yy", rhs: '"+yy', context: "normal" },
            { lhs: "jj", rhs: "<Esc>", context: "insert" },
        ])
    })

    it("parseVimMappingText 继续兼容箭头格式和空格格式", () => {
        const result = parseVimMappingText('yy => "+yy\np <Esc>')

        expect(result).toEqual([
            { lhs: "yy", rhs: '"+yy', context: "normal" },
            { lhs: "p", rhs: "<Esc>", context: "insert" },
        ])
    })

    it("parseVimMappingText 在空内容时返回空映射", () => {
        const result = parseVimMappingText("   \n\n")

        expect(result).toEqual([])
    })

    it("parseVimMappingText 在格式错误时抛出带行号的异常", () => {
        expect(() => parseVimMappingText("invalid-line")).toThrow("第 1 行格式无效")
    })

    it("parseVimMappingText 在 context 非法时抛出异常", () => {
        expect(() => parseVimMappingText('("jj", "<Esc>", "command")')).toThrow("第 1 行格式无效")
    })
})

describe("clearVimDefaults", () => {
    it("调用后 loadVimDefaults 返回 null", () => {
        saveVimDefaults({ enabled: true, mappings: [{ lhs: "yy", rhs: '"+yy' }], imePort: DEFAULT_VIM_IME_PORT })
        clearVimDefaults()

        expect(loadVimDefaults()).toBeNull()
    })

    it("getDefaultVimDefaults 使用空用户映射, 保持原生 Vim 行为", () => {
        expect(getDefaultVimDefaults().mappings).toEqual(DEFAULT_VIM_MAPPINGS)
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
