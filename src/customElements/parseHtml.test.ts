/*
 * FilePath    : blog-client-nuxt\src\customElements\parseHtml.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : parseHtmlToContentParts 双端同构单元测试(feature02)
 */

/*
 * 补充说明:
 * 客户端路径 (DOMParser, happy-dom) 与服务端路径 (node-html-parser, 桩掉 DOMParser)
 * 必须产出完全一致的片段结构, 这是 SSR 直出正文与 hydration 对齐的前提
 */

import { createPinia, setActivePinia } from "pinia"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Names } from "@/customElements/constants"
import { parseHtmlToContentParts, type ContentPart } from "@/customElements/parseHtml"
import { renderMarkdownDocument } from "@/utils/markdownRenderer"

// 计划 feature02 验收样本: 普通内容 + NOTE alert + 图片 + pay-read + video-player
const PLAN_SAMPLE_MARKDOWN = [
    "# 测试注水内容",
    "",
    "普通内容测试注水内容第1行",
    "",
    "普通内容测试注水内容第2行",
    "",
    "普通内容测试注水内容第3行",
    "",
    "![ssr图片可见](http://10.10.2.222:7364/api/v1/uploads/2026/08/24/p-108-92c42546.png)",
    "",
    "",
    "> [!NOTE]",
    "> NOTE测试注水内容第1行",
    "> NOTE测试注水内容第2行",
    "> NOTE测试注水内容第3行",
    "",
    "",
    "<pay-read>",
    "",
    "付费阅读测试注水内容第1行",
    "",
    "付费阅读测试注水内容第2行",
    "",
    "付费阅读测试注水内容第3行",
    "",
    "</pay-read>",
    "",
    "## 测试 ssr 视频",
    "",
    "当前视频描述可以 ssr 展示，如下视频组件，属于 csr。",
    "",
    '<video-player video-type="hls" id="m-107-623fc986"></video-player>',
].join("\n")

// 类型序列(片段结构)提取
const typeSequence = (parts: ContentPart[]) => parts.map((p) => p.type)

// html 片段内容提取
const htmlContents = (parts: ContentPart[]) => parts.filter((p) => p.type === "html").map((p) => (p as { type: "html"; content: string }).content)

describe("parseHtmlToContentParts 双端同构(feature02)", () => {
    beforeEach(() => {
        // getVideoPlayerState → useVideoWatermark 读取 options/user store, 需要激活 pinia
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("不含自定义元素时返回单个 html 片段(双端走同一快速路径)", () => {
        const html = "<h1>标题</h1><p>正文</p>"
        const parts = parseHtmlToContentParts(html, "p-1")
        expect(parts).toHaveLength(1)
        expect(parts[0]).toEqual({ type: "html", content: html })
    })

    it("客户端(DOMParser)路径按自定义元素边界拆分片段", () => {
        const html = renderMarkdownDocument(PLAN_SAMPLE_MARKDOWN, false).html
        const parts = parseHtmlToContentParts(html, "p-1", false)

        const types = typeSequence(parts)
        expect(types).toContain(Names.PayRead)
        expect(types).toContain(Names.VideoPlayer)
        expect(parts[0]?.type).toBe("html")

        // 付费阅读片段为 markdown 渲染后的 html 内容
        const payRead = parts.find((p) => p.type === Names.PayRead)
        expect(payRead).toBeDefined()
        expect((payRead as { content: string }).content).toContain("付费阅读测试注水内容第1行")

        // 视频播放器片段携带真实播放器状态(客户端渲染使用)
        const video = parts.find((p) => p.type === Names.VideoPlayer)
        expect(video?.content).toMatchObject({ videoID: "m-107-623fc986" })
    })

    it("服务端(node-html-parser)路径与客户端路径片段结构与 html 内容一致", () => {
        const html = renderMarkdownDocument(PLAN_SAMPLE_MARKDOWN, false).html

        // 客户端路径(happy-dom 提供 DOMParser)
        const clientParts = parseHtmlToContentParts(html, "p-1", false)

        // 服务端路径: 桩掉 DOMParser, 走 node-html-parser 分支
        vi.stubGlobal("DOMParser", undefined)
        const serverParts = parseHtmlToContentParts(html, "p-1", false)

        // 片段结构(类型序列)必须一致: hydration 的 v-for 节点序列据此对齐
        expect(typeSequence(serverParts)).toEqual(typeSequence(clientParts))

        // html 片段内容逐字节一致: SSR innerHTML 与客户端水合首帧相同
        expect(htmlContents(serverParts)).toEqual(htmlContents(clientParts))
    })

    it("代码块中的自定义元素标签不参与拆分", () => {
        const html = '<p>前</p><pre class="pre-code-container"><code>&lt;video-player video-type="hls" id="m-1"&gt;&lt;/video-player&gt;</code></pre><p>后</p>'
        const parts = parseHtmlToContentParts(html, "p-1")
        expect(typeSequence(parts)).toEqual(["html"])
    })

    it("pay-video 携带 has-material 属性时双端结构一致且标记保留", () => {
        const html = '<p>a</p><pay-video has-material><p>资料</p><video-player video-type="hls" id="m-2"></video-player></pay-video><p>b</p>'
        const clientParts = parseHtmlToContentParts(html, "p-1")

        vi.stubGlobal("DOMParser", undefined)
        const serverParts = parseHtmlToContentParts(html, "p-1")

        expect(typeSequence(serverParts)).toEqual(typeSequence(clientParts))

        const clientPay = clientParts.find((p) => p.type === Names.PayVideo)
        expect(clientPay?.hasMaterial).toBe(true)
    })
})
