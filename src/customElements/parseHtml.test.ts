/**
 * FilePath    : blog-client\src\customElements\parseHtml.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : parseHtmlToContentParts 测试
 */

import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/hooks/useVideoWatermark", () => ({
    useVideoWatermark: vi.fn(),
}))

import { markdownToHtml } from "@/components/editor/utils"

import { parseHtmlToContentParts } from "./parseHtml"
import { Names } from "./registerCustomElements"

describe("parseHtmlToContentParts", () => {
    it("管理员视频预览会将 isAdmin 透传给播放器状态", () => {
        const parts = parseHtmlToContentParts('<video-player video-type="hls" id="m-13-8e72860c"></video-player>', "post-1", true)

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe(Names.VideoPlayer)
        expect(parts[0]?.content).toMatchObject({
            isAdmin: true,
            postId: "post-1",
            videoID: "m-13-8e72860c",
        })
    })

    it("非管理员预览默认不启用管理员视频接口", () => {
        const parts = parseHtmlToContentParts('<video-player video-type="hls" id="m-13-8e72860c"></video-player>', "post-1")

        expect(parts[0]?.content).toMatchObject({
            isAdmin: false,
            postId: "post-1",
        })
    })

    it("不含真实自定义元素时走快速路径, 不触发 DOMParser", () => {
        const parseFromString = vi.fn()
        const originalDOMParser = globalThis.DOMParser

        class MockDOMParser {
            parseFromString(): never {
                parseFromString()
                throw new Error("不应触发 DOMParser")
            }
        }

        vi.stubGlobal("DOMParser", MockDOMParser)

        try {
            const html = "<p>plain html <code>&lt;pay-read&gt;</code></p>"
            const parts = parseHtmlToContentParts(html, "post-1")

            expect(parts).toEqual([{ type: "html", content: html }])
            expect(parseFromString).not.toHaveBeenCalled()
        } finally {
            vi.stubGlobal("DOMParser", originalDOMParser)
        }
    })

    describe.each(Object.values(Names))("hasCustomElementMarkup 快速路径覆盖 %s", (tagName) => {
        it(`仅包含转义后的 <${tagName}> 时继续走快速路径`, () => {
            const parseFromString = vi.fn()
            const originalDOMParser = globalThis.DOMParser

            class MockDOMParser {
                parseFromString(): never {
                    parseFromString()
                    throw new Error(`转义标签 ${tagName} 不应触发 DOMParser`)
                }
            }

            vi.stubGlobal("DOMParser", MockDOMParser)

            try {
                const html = `<p>prefix <code>&lt;${tagName}&gt;</code> suffix</p>`
                const parts = parseHtmlToContentParts(html, "post-1")

                expect(parts).toEqual([{ type: "html", content: html }])
                expect(parseFromString).not.toHaveBeenCalled()
            } finally {
                vi.stubGlobal("DOMParser", originalDOMParser)
            }
        })

        it(`包含真实 <${tagName}> 时会进入 DOMParser 解析分支`, () => {
            const parseFromString = vi.fn<(html: string, mimeType: string) => { body: { childNodes: never[] } }>(() => ({
                body: {
                    childNodes: [],
                },
            }))
            const originalDOMParser = globalThis.DOMParser

            class MockDOMParser {
                parseFromString(html: string, mimeType: string) {
                    parseFromString(html, mimeType)
                    return {
                        body: {
                            childNodes: [],
                        },
                    }
                }
            }

            vi.stubGlobal("DOMParser", MockDOMParser)

            try {
                const html = `<${tagName}></${tagName}>`
                parseHtmlToContentParts(html, "post-1")

                expect(parseFromString).toHaveBeenCalledTimes(1)
                expect(parseFromString).toHaveBeenCalledWith(html, "text/html")
            } finally {
                vi.stubGlobal("DOMParser", originalDOMParser)
            }
        })
    })
})

describe("pay-* 组件在代码块中的防护", () => {
    it("单个反引号包裹的 pay-read 会作为普通 html 片段保留", () => {
        const html = "<p><code>&lt;pay-read&gt;</code></p>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("html")
        expect(parts[0]?.content).toContain("<code>&lt;pay-read&gt;</code>")
        expect(parts.some((part) => part.type === Names.PayRead)).toBe(false)
    })

    it("三个反引号包裹的单个 pay-read 不会触发付费组件解析", () => {
        const html = "<pre><code><pay-read></pay-read></code></pre>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("html")
        expect(parts[0]?.content).toContain("<pre><code>&lt;pay-read&gt;&lt;/pay-read&gt;</code></pre>")
        expect(parts.some((part) => part.type === Names.PayRead)).toBe(false)
    })

    it("三个反引号包裹多个 pay-* 标签时会统一保留为普通 html", () => {
        const html = "<pre><code><pay-read></pay-read><pay-download></pay-download></code></pre>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("html")
        expect(parts[0]?.content).toContain("&lt;pay-read&gt;&lt;/pay-read&gt;")
        expect(parts[0]?.content).toContain("&lt;pay-download&gt;&lt;/pay-download&gt;")
        expect(parts.some((part) => part.type === Names.PayRead || part.type === Names.PayDownload)).toBe(false)
    })

    it("代码块内的 pay-read 不触发, 代码块外的真实 pay-read 正常触发", () => {
        const html = "<pre><code><pay-read></pay-read></code></pre><pay-read><p>外部内容</p></pay-read>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(2)
        expect(parts[0]?.type).toBe("html")
        expect(parts[0]?.content).toContain("&lt;pay-read&gt;&lt;/pay-read&gt;")
        expect(parts[1]).toMatchObject({
            type: Names.PayRead,
            content: "<p>外部内容</p>",
        })
    })
})

describe("pay-* 组件真实自定义元素解析", () => {
    it("真实 pay-read 自定义元素正常解析", () => {
        const html = "<pay-read><p>付费阅读内容</p></pay-read>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]).toMatchObject({
            type: Names.PayRead,
            content: "<p>付费阅读内容</p>",
        })
    })

    it("真实 pay-download 自定义元素正常解析", () => {
        const html = '<pay-download><a href="/demo.zip">下载</a></pay-download>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]).toMatchObject({
            type: Names.PayDownload,
            content: '<a href="/demo.zip">下载</a>',
        })
    })

    it("真实 pay-video 自定义元素正常解析", () => {
        const html = '<pay-video has-material><video-player id="video-1"></video-player></pay-video>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]).toMatchObject({
            type: Names.PayVideo,
            content: '<video-player id="video-1"></video-player>',
            hasMaterial: true,
        })
    })
})

describe("power-bi 自定义元素解析", () => {
    it("解析单个 power-bi 元素，包含有效的 src 属性", () => {
        const html = '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff"></power-bi>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("power-bi")
        expect(parts[0]?.content).toMatchObject({
            src: "https://app.powerbi.com/reportEmbed?reportId=abc123",
            maskcolor: "#ffffff",
        })
    })

    it("解析多个内容混合的 power-bi 元素", () => {
        const html = '<p>前置文本</p><power-bi src="https://app.powerbi.com/reportEmbed?reportId=xyz789" maskcolor="#abc"></power-bi><p>后置文本</p>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(3)
        expect(parts[1]?.type).toBe("power-bi")
        expect(parts[1]?.content).toMatchObject({
            src: "https://app.powerbi.com/reportEmbed?reportId=xyz789",
            maskcolor: "#abc",
        })
    })

    it("解析 power-bi 元素，空 src 属性", () => {
        const html = '<power-bi src="" maskcolor=""></power-bi>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("power-bi")
        expect(parts[0]?.content).toMatchObject({
            src: "",
            maskcolor: "",
        })
    })

    it("解析缺省 maskcolor 属性时保持属性不存在", () => {
        const html = '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=maskless"></power-bi>'
        const parts = parseHtmlToContentParts(html, "post-1")
        const content = parts[0]?.content as { src: string; maskcolor?: string } | undefined

        expect(content).toMatchObject({
            src: "https://app.powerbi.com/reportEmbed?reportId=maskless",
        })
        expect(content?.maskcolor).toBeUndefined()
    })
})

describe("wechat-captcha 自定义元素解析", () => {
    it("解析单个 wechat-captcha 元素，包含有效属性和隐藏内容", () => {
        const html = '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148"><p>隐藏内容</p></wechat-captcha>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe(Names.WechatCaptcha)
        expect(parts[0]?.content).toMatchObject({
            name: "焦棚子",
            codeurl: "https://example.com/qrcode.png",
            verifyKey: "1120",
            reply: "demo148",
            hiddenHtml: "<p>隐藏内容</p>",
        })
    })

    it("解析缺省属性时保持为空字符串并保留嵌套组件内容", () => {
        const html =
            '<wechat-captcha name="" codeurl="" key="" reply=""><power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123"></power-bi></wechat-captcha>'
        const parts = parseHtmlToContentParts(html, "post-1")
        const content = parts[0]?.content as
            | {
                  name: string
                  codeurl: string
                  verifyKey: string
                  reply: string
                  hiddenHtml: string
              }
            | undefined

        expect(content).toMatchObject({
            name: "",
            codeurl: "",
            verifyKey: "",
            reply: "",
        })
        expect(content?.hiddenHtml).toContain("<power-bi")
    })
})

describe("pay-* 组件在代码块中的防护 - 全量覆盖", () => {
    // 所有 pay-* 自定义元素标签
    const payTags = [Names.PayRead, Names.PayDownload, Names.PayVideo, Names.PayKey, Names.PayMembership]

    describe.each(payTags)("单反引号(行内代码)包裹 %s", (tag) => {
        it(`<code>&lt;${tag}&gt;</code> 不会被识别为真实自定义元素`, () => {
            const html = `<p>前缀 <code>&lt;${tag}&gt;</code> 后缀</p>`
            const parts = parseHtmlToContentParts(html, "post-1")

            expect(parts).toHaveLength(1)
            expect(parts[0]?.type).toBe("html")
            expect(parts[0]?.content).toContain(`<code>&lt;${tag}&gt;</code>`)
            expect(parts.some((part) => part.type === tag)).toBe(false)
        })

        it(`<code>&lt;${tag} attr="x"&gt;</code> 带属性的行内代码也不会触发`, () => {
            const html = `<p><code>&lt;${tag} id="abc"&gt;</code></p>`
            const parts = parseHtmlToContentParts(html, "post-1")

            expect(parts).toHaveLength(1)
            expect(parts[0]?.type).toBe("html")
            expect(parts.some((part) => part.type === tag)).toBe(false)
        })
    })

    describe.each(payTags)("三反引号(围栏代码块)包裹 %s", (tag) => {
        it(`<pre><code>&lt;${tag}&gt;&lt;/${tag}&gt;</code></pre> 不会被识别为真实自定义元素`, () => {
            const html = `<pre><code>&lt;${tag}&gt;&lt;/${tag}&gt;</code></pre>`
            const parts = parseHtmlToContentParts(html, "post-1")

            expect(parts).toHaveLength(1)
            expect(parts[0]?.type).toBe("html")
            expect(parts[0]?.content).toContain(`&lt;${tag}&gt;`)
            expect(parts.some((part) => part.type === tag)).toBe(false)
        })

        it(`原始未转义的 <pre><code><${tag}></${tag}></code></pre> 也会被防护`, () => {
            const html = `<pre><code><${tag}></${tag}></code></pre>`
            const parts = parseHtmlToContentParts(html, "post-1")

            expect(parts).toHaveLength(1)
            expect(parts[0]?.type).toBe("html")
            expect(parts[0]?.content).toContain(`&lt;${tag}&gt;&lt;/${tag}&gt;`)
            expect(parts.some((part) => part.type === tag)).toBe(false)
        })
    })

    it("行内代码包裹的多个 pay-* 标签同时存在时全部被保护", () => {
        const html = "<p><code>&lt;pay-read&gt;</code>、<code>&lt;pay-download&gt;</code>、<code>&lt;pay-video&gt;</code></p>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("html")
        expect(parts[0]?.content).toContain("<code>&lt;pay-read&gt;</code>")
        expect(parts[0]?.content).toContain("<code>&lt;pay-download&gt;</code>")
        expect(parts[0]?.content).toContain("<code>&lt;pay-video&gt;</code>")
        expect(parts.some((part) => [Names.PayRead, Names.PayDownload, Names.PayVideo].includes(part.type as Names))).toBe(false)
    })

    it("围栏代码块同时包裹 pay-* 与 power-bi/login-view 等其它自定义元素", () => {
        const html = "<pre><code><pay-read></pay-read><power-bi></power-bi><login-view></login-view></code></pre>"
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("html")
        expect(parts[0]?.content).toContain("&lt;pay-read&gt;&lt;/pay-read&gt;")
        expect(parts[0]?.content).toContain("&lt;power-bi&gt;&lt;/power-bi&gt;")
        expect(parts[0]?.content).toContain("&lt;login-view&gt;&lt;/login-view&gt;")
        expect(parts.some((part) => part.type !== "html")).toBe(false)
    })

    it("代码块内的 pay-* 与代码块外的真实 pay-* 同时存在时分别正确处理", () => {
        const html =
            "<p><code>&lt;pay-read&gt;</code></p>" +
            "<pre><code>&lt;pay-download&gt;&lt;/pay-download&gt;</code></pre>" +
            "<pay-read><p>真实付费阅读</p></pay-read>" +
            '<pay-download><a href="/x.zip">x</a></pay-download>'
        const parts = parseHtmlToContentParts(html, "post-1")

        // 两段代码块片段会被合并为同一个 html 块, 后续两个真实自定义元素分别成块
        expect(parts.filter((p) => p.type === Names.PayRead)).toHaveLength(1)
        expect(parts.filter((p) => p.type === Names.PayDownload)).toHaveLength(1)
        expect(parts.find((p) => p.type === Names.PayRead)).toMatchObject({
            type: Names.PayRead,
            content: "<p>真实付费阅读</p>",
        })
        expect(parts.find((p) => p.type === Names.PayDownload)).toMatchObject({
            type: Names.PayDownload,
            content: '<a href="/x.zip">x</a>',
        })
        // 仍然保留代码块对 pay-* 的转义
        const htmlContent = parts
            .filter((p) => p.type === "html")
            .map((p) => p.content as string)
            .join("")
        expect(htmlContent).toContain("<code>&lt;pay-read&gt;</code>")
        expect(htmlContent).toContain("&lt;pay-download&gt;&lt;/pay-download&gt;")
    })
})

describe("pay-* 组件代码块防护 - 端到端 markdown 流水线", () => {
    /**
     * 该测试块通过 markdownToHtml 完整复现 .bug/260426-03.md 报告的场景:
     * 1. 行内代码 `<pay-read>` 在未登录预览中被错误地识别为真实自定义元素
     * 2. 围栏代码块内出现 pay-* 时不应当触发付费组件渲染
     * 通过 marked + parseHtmlToContentParts 端到端校验, 防止跨层回归。
     */
    it("行内代码 `<pay-read>`、`<power-bi>`、`<wechat-captcha>` 不会触发自定义元素解析", () => {
        const md = ["### 2.2 支持这些增强语法", "", "- 项目自定义标签（例如 `<pay-read>`、`<power-bi>`、`<wechat-captcha>`）", "", "后面的内容", ""].join("\n")
        const html = markdownToHtml(md, false)
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("html")
        // 必须保留行内代码的实体转义形式
        expect(parts[0]?.content).toContain("<code>&lt;pay-read&gt;</code>")
        expect(parts[0]?.content).toContain("<code>&lt;power-bi&gt;</code>")
        expect(parts[0]?.content).toContain("<code>&lt;wechat-captcha&gt;</code>")
        // "后面的内容" 不应被吞掉
        expect(parts[0]?.content).toContain("后面的内容")
        // 不应出现真实的 pay-read / power-bi / wechat-captcha 自定义元素片段
        expect(parts.some((part) => part.type !== "html")).toBe(false)
    })

    it("围栏代码块内的 <pay-read> 不会触发付费组件, 紧随其后的真实 <pay-read> 仍然正常解析", () => {
        const md = [
            "示例代码:",
            "",
            "```html",
            "<pay-read>这里是说明</pay-read>",
            "```",
            "",
            "<pay-read>",
            "",
            "真实隐藏内容",
            "",
            "</pay-read>",
            "",
            "结尾",
            "",
        ].join("\n")
        const html = markdownToHtml(md, false)
        const parts = parseHtmlToContentParts(html, "post-1")

        const payReadParts = parts.filter((p) => p.type === Names.PayRead)
        expect(payReadParts).toHaveLength(1)
        // 真实 pay-read 内容应当包含 "真实隐藏内容"
        expect(payReadParts[0]?.content as string).toContain("真实隐藏内容")
        // 整体片段中不应丢失结尾段落
        const fullHtml = parts.map((p) => (typeof p.content === "string" ? p.content : "")).join("")
        expect(fullHtml).toContain("结尾")
    })

    it("emoji 短码会转成真实表情, 未知短码保持原样", () => {
        const md = ["支持已知 emoji: :rocket: :grinning_face:", "", "保留未知短码: :not-found-emoji:", ""].join("\n")
        const html = markdownToHtml(md, false)

        expect(html).toContain("支持已知 emoji: 🚀 😀")
        expect(html).toContain("保留未知短码: :not-found-emoji:")
    })
})
