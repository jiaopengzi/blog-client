/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\006.test.ts
 * Author      : jiaopengzi
 * Description : 测试 rule006 - 检测 video-player 标签是否合法
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { run } from "../006"
import { makeDoc } from "./utils"

describe("rule006 - video-player 标签合法性检测", () => {
    it("正确的单行 video-player 不返回诊断", () => {
        const doc = makeDoc(['<video-player video-type="hls" id="m-1"></video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("未闭合的开始标签应返回 error", () => {
        const doc = makeDoc(['<video-player video-type="hls" id="x">'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d1 = diags[0]!
        expect(d1.severity).toBe("error")
        expect(d1.message).toContain("未闭合")
    })

    it("缺少 video-type 属性应报错", () => {
        const doc = makeDoc(['<video-player id="x"></video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("缺少属性: video-type"))).toBe(true)
    })

    it("video-type 为 hls 时, id 属性不能为空", () => {
        const doc = makeDoc(['<video-player video-type="hls"></video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("video-player video-type 为 hls 时, id 属性不能为空"))).toBe(true)
    })

    it("video-type 为非 hls 时, src 属性不能为空", () => {
        const doc = makeDoc(['<video-player video-type="mp4"></video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("src 属性不能为空"))).toBe(true)
    })

    it("单行内包含内容应报错", () => {
        const doc = makeDoc(['<video-player video-type="hls" id="1">content</video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("不应包含内容"))).toBe(true)
    })

    it("开始标签前有内容应报错", () => {
        const doc = makeDoc(['pre <video-player video-type="hls" id="x"></video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("标签前不应有内容"))).toBe(true)
    })

    it("结束标签后有内容应报错", () => {
        const doc = makeDoc(['<video-player video-type="hls" id="x"></video-player> post'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("标签后不应有内容"))).toBe(true)
    })

    it("多行时应报错为单行要求", () => {
        const doc = makeDoc(['<video-player video-type="hls" id="x">', "", "</video-player>"])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("应为单行"))).toBe(true)
    })

    it("缺少前后空行应报错", () => {
        const doc = makeDoc(["pre", '<video-player video-type="hls" id="x"></video-player>', "post"])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("前应有空行"))).toBe(true)
        expect(diags.some((d) => d.message.includes("后应有空行"))).toBe(true)
    })
})
