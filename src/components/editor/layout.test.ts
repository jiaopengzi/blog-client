/**
 * FilePath    : blog-client\src\components\editor\layout.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器布局比例工具函数单元测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LocalStorageKey } from "@/stores/local"

import {
    buildEditorGridTemplate,
    clearEditorPaneRatios,
    DEFAULT_EDITOR_PANE_RATIOS,
    isDefaultEditorPaneRatios,
    loadEditorPaneRatios,
    resizeEditorPaneRatios,
    saveEditorPaneRatios,
} from "./layout"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

describe("saveEditorPaneRatios + loadEditorPaneRatios", () => {
    it("保存后可以正确读取三栏比例", () => {
        const ratios = { toc: 1.2, editor: 2.1, preview: 1.7 }
        saveEditorPaneRatios(ratios)

        expect(loadEditorPaneRatios()).toEqual(ratios)
    })

    it("读取到非法 JSON 时返回 null", () => {
        localStorage.setItem(LocalStorageKey.EditorPaneRatios, "{")

        expect(loadEditorPaneRatios()).toBeNull()
    })

    it("clearEditorPaneRatios 会移除已保存的比例", () => {
        saveEditorPaneRatios({ toc: 1.2, editor: 2.1, preview: 1.7 })

        clearEditorPaneRatios()

        expect(loadEditorPaneRatios()).toBeNull()
    })
})

describe("isDefaultEditorPaneRatios", () => {
    it("默认比例会被识别为默认布局", () => {
        expect(isDefaultEditorPaneRatios(DEFAULT_EDITOR_PANE_RATIOS)).toBe(true)
    })

    it("拖拽后的比例不会被识别为默认布局", () => {
        expect(isDefaultEditorPaneRatios({ toc: 1.25, editor: 1.75, preview: 2 })).toBe(false)
    })
})

describe("buildEditorGridTemplate", () => {
    it("会按可见栏位顺序生成 grid 模板", () => {
        const template = buildEditorGridTemplate(["toc", "editor", "preview"], DEFAULT_EDITOR_PANE_RATIOS)

        expect(template).toBe("minmax(0, 1fr) 8px minmax(0, 2fr) 8px minmax(0, 2fr)")
    })
})

describe("resizeEditorPaneRatios", () => {
    it("拖拽时只会调整分隔条两侧的比例", () => {
        const nextRatios = resizeEditorPaneRatios({
            ratios: DEFAULT_EDITOR_PANE_RATIOS,
            visiblePanes: ["toc", "editor", "preview"],
            leftPane: "toc",
            rightPane: "editor",
            containerWidth: 1000,
            deltaPx: 50,
        })

        expect(nextRatios.toc).toBeCloseTo(1.25, 2)
        expect(nextRatios.editor).toBeCloseTo(1.75, 2)
        expect(nextRatios.preview).toBe(2)
    })

    it("拖拽结果会被最小宽度限制住", () => {
        const nextRatios = resizeEditorPaneRatios({
            ratios: DEFAULT_EDITOR_PANE_RATIOS,
            visiblePanes: ["toc", "editor"],
            leftPane: "toc",
            rightPane: "editor",
            containerWidth: 700,
            deltaPx: -500,
        })

        expect(nextRatios.toc).toBeCloseTo(0.78, 2)
        expect(nextRatios.editor).toBeCloseTo(2.22, 2)
    })
})
