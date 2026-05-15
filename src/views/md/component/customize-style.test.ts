/**
 * FilePath    : blog-client\src\views\md\component\customize-style.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义样式相关工具函数测试
 */

import { describe, expect, it } from "vitest"

import { ImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import { getDefaultMdCustomState } from "@/stores/md-custom"

import { buildMdCustomizerEditorDoc, buildMdPresetCss } from "./customize-style"

describe("buildMdPresetCss", () => {
    it("主站默认字号与首行缩进不应写入自动生成样式", () => {
        const state = getDefaultMdCustomState()

        const css = buildMdPresetCss(state)

        expect(css).not.toContain("font-size")
        expect(css).not.toContain("text-indent")
    })

    it("关闭首行缩进时应输出覆盖规则", () => {
        const state = { ...getDefaultMdCustomState(), paragraphIndent: "0" }

        const css = buildMdPresetCss(state)

        expect(css).toContain("--preview-paragraph-indent: 0 !important;")
        expect(css).toContain("text-indent: 0 !important;")
    })

    it("自定义字号时应输出字号覆盖规则", () => {
        const state = { ...getDefaultMdCustomState(), fontSize: "18px" }

        const css = buildMdPresetCss(state)

        expect(css).toContain("font-size: 18px !important;")
    })
})

describe("buildMdCustomizerEditorDoc", () => {
    it("重置后的自动生成区不应包含默认字号和默认首行缩进规则", () => {
        const state = getDefaultMdCustomState()

        const doc = buildMdCustomizerEditorDoc(state)

        expect(doc).not.toContain("font-size: 16px")
        expect(doc).not.toContain("text-indent: 2em")
    })

    it("保留非默认配置时应仍然写入对应规则", () => {
        const state = {
            ...getDefaultMdCustomState(),
            imageCaptionFormat: ImageCaptionFormat.Filename,
            fontSize: "20px",
            paragraphIndent: "0",
        }

        const doc = buildMdCustomizerEditorDoc(state)

        expect(doc).toContain("font-size: 20px !important;")
        expect(doc).toContain("--preview-paragraph-indent: 0 !important;")
        expect(doc).toContain("text-indent: 0 !important;")
    })
})
