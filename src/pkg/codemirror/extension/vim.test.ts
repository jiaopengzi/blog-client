/*
 * FilePath    : blog-client\src\pkg\codemirror\extension\vim.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Vim 扩展工具测试
 */

import { EditorState } from "@codemirror/state"
import { drawSelection, EditorView } from "@codemirror/view"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { applyVimMappings, createVimExtension, getDefaultVimClipboardBridges, Vim } from "./vim"

type TestEditorView = EditorView & {
    cm: Parameters<typeof Vim.handleKey>[0]
}

let clipboardText = ""
let writeTextMock: ReturnType<typeof vi.fn>
let readTextMock: ReturnType<typeof vi.fn>
let mountedEditor: EditorView | null = null

/**
 * flushClipboardActions 等待 Vim 自定义剪贴板 action 里的异步链完成.
 * 当前 bridge 主要走 copyText 的 Promise 链, 这里额外多等待几轮微任务, 避免测试在异步写剪贴板前断言.
 * @returns 无返回值.
 */
async function flushClipboardActions(): Promise<void> {
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
}

/**
 * createTestVimView 创建一个带 Vim 扩展的最小编辑器实例, 用于行为级测试.
 * @param doc - 编辑器初始文档内容.
 * @returns 带 cm 适配器的 EditorView.
 */
function createTestVimView(doc: string): TestEditorView {
    const parent = document.createElement("div")
    document.body.appendChild(parent)

    const view = new EditorView({
        parent,
        state: EditorState.create({
            doc,
            extensions: [createVimExtension(), drawSelection()],
        }),
    }) as TestEditorView

    mountedEditor = view
    return view
}

beforeEach(() => {
    clipboardText = ""
    writeTextMock = vi.fn(async (text: string) => {
        clipboardText = text
    })
    readTextMock = vi.fn(async () => clipboardText)

    Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
            writeText: writeTextMock,
            readText: readTextMock,
        },
    })

    Vim.mapclear("normal")
    Vim.mapclear("visual")
    Vim.mapclear("operatorPending")
})

afterEach(() => {
    mountedEditor?.destroy()
    mountedEditor = null
    Vim.mapclear("normal")
    Vim.mapclear("visual")
    Vim.mapclear("operatorPending")
    vi.restoreAllMocks()
})

describe("getDefaultVimClipboardBridges", () => {
    it("无用户映射时不启用任何系统剪贴板桥接", () => {
        expect(getDefaultVimClipboardBridges([])).toEqual([])
    })

    it("显式 p 系统剪贴板映射会额外推导出 visual p 桥接", () => {
        expect(
            getDefaultVimClipboardBridges([
                { lhs: "yy", rhs: '"+yy' },
                { lhs: "p", rhs: '"+p' },
            ]).map((item) => `${item.context}:${item.lhs}:${item.action}`),
        ).toEqual(["normal:p:clipboardPasteAfter", "visual:p:clipboardPasteAfter"])
    })
})

describe("applyVimMappings", () => {
    it("空配置时 yy 走原生寄存器, 不会进入系统剪贴板", async () => {
        applyVimMappings([])

        const view = createTestVimView("alpha\nbeta\n")

        Vim.handleKey(view.cm, "y", "user")
        Vim.handleKey(view.cm, "y", "user")
        await flushClipboardActions()

        expect(writeTextMock).not.toHaveBeenCalled()
        expect(clipboardText).toBe("")
    })

    it("空配置时 p 只粘贴原生 yank 结果, 不会读取系统剪贴板", async () => {
        clipboardText = "CLIP"
        applyVimMappings([])

        const view = createTestVimView("alpha\nbeta\n")

        Vim.handleKey(view.cm, "y", "user")
        Vim.handleKey(view.cm, "y", "user")
        await flushClipboardActions()

        view.cm.setCursor({ line: 1, ch: 0 })
        Vim.handleKey(view.cm, "p", "user")
        await flushClipboardActions()

        expect(readTextMock).not.toHaveBeenCalled()
        expect(view.state.doc.toString()).toBe("alpha\nbeta\nalpha\n")
    })

    it("空配置时 visual y 不会写入系统剪贴板, 且仍保持原生 p 行为", async () => {
        applyVimMappings([])

        const view = createTestVimView("alpha\n")

        Vim.handleKey(view.cm, "v", "user")
        Vim.handleKey(view.cm, "l", "user")
        Vim.handleKey(view.cm, "l", "user")
        Vim.handleKey(view.cm, "y", "user")
        await flushClipboardActions()

        expect(writeTextMock).not.toHaveBeenCalled()
        expect(clipboardText).toBe("")

        Vim.handleKey(view.cm, "p", "user")
        await flushClipboardActions()

        expect(view.state.doc.toString()).toBe("aalplpha\n")
    })

    it("显式 yy / p 系统剪贴板桥接启用后, yy 会写入系统剪贴板且 normal p 会读取外部系统剪贴板", async () => {
        applyVimMappings([
            { lhs: "yy", rhs: '"+yy' },
            { lhs: "p", rhs: '"+p' },
        ])

        const view = createTestVimView("alpha\nbeta\n")

        Vim.handleKey(view.cm, "y", "user")
        Vim.handleKey(view.cm, "y", "user")
        await flushClipboardActions()

        expect(writeTextMock).toHaveBeenCalledWith("alpha")
        expect(clipboardText).toBe("alpha")

        clipboardText = "CLIP"
        view.cm.setCursor({ line: 1, ch: 3 })
        Vim.handleKey(view.cm, "p", "user")
        await flushClipboardActions()

        expect(readTextMock).toHaveBeenCalledTimes(1)
        expect(view.state.doc.toString()).toBe("alpha\nbetaCLIP\n")
    })

    it("显式 yy 和 p 系统剪贴板映射启用后, visual p 也会读取外部系统剪贴板", async () => {
        applyVimMappings([
            { lhs: "yy", rhs: '"+yy' },
            { lhs: "p", rhs: '"+p' },
        ])

        const view = createTestVimView("alpha\n")
        clipboardText = "CLIP"

        Vim.handleKey(view.cm, "v", "user")
        Vim.handleKey(view.cm, "l", "user")
        Vim.handleKey(view.cm, "l", "user")
        Vim.handleKey(view.cm, "p", "user")
        await flushClipboardActions()

        expect(readTextMock).toHaveBeenCalledTimes(1)
        expect(view.state.doc.toString()).toBe("CLIPha\n")
    })

    it("显式 yy / p 系统剪贴板桥接启用后, dd 删除结果会镜像到系统剪贴板并被 p 继续粘贴", async () => {
        applyVimMappings([
            { lhs: "yy", rhs: '"+yy' },
            { lhs: "p", rhs: '"+p' },
        ])

        const view = createTestVimView("alpha\nbeta\n")

        Vim.handleKey(view.cm, "d", "user")
        Vim.handleKey(view.cm, "d", "user")
        await flushClipboardActions()

        Vim.handleKey(view.cm, "p", "user")
        await flushClipboardActions()

        expect(writeTextMock).toHaveBeenCalledWith("alpha")
        expect(readTextMock).toHaveBeenCalledTimes(1)
        expect(view.state.doc.toString()).toBe("beta\nalpha\n")
    })

    it("jj => <Esc> 会注册在 insert 上下文并生效", async () => {
        applyVimMappings([{ lhs: "jj", rhs: "<Esc>" }])

        const view = createTestVimView("alpha")

        Vim.handleKey(view.cm, "i", "user")
        Vim.handleKey(view.cm, "j", "user")
        Vim.handleKey(view.cm, "j", "user")
        await flushClipboardActions()

        expect(Boolean(view.cm.state.vim?.insertMode)).toBe(false)
    })

    it("原生 clipboard 写入失败时会回退到 execCommand, 不会递归卡死", async () => {
        vi.resetModules()

        const originalWriteTextMock = vi.fn(async () => {
            throw new Error("clipboard denied")
        })
        const originalReadTextMock = vi.fn(async () => "")
        const execCommandMock = vi.fn(() => true)

        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: {
                writeText: originalWriteTextMock,
                readText: originalReadTextMock,
            },
        })

        Object.defineProperty(document, "execCommand", {
            configurable: true,
            value: execCommandMock,
        })

        const vimModule = await import("./vim")
        vimModule.applyVimMappings([{ lhs: "yy", rhs: '"+yy' }])

        const parent = document.createElement("div")
        document.body.appendChild(parent)

        const view = new EditorView({
            parent,
            state: EditorState.create({
                doc: "alpha\n",
                extensions: [vimModule.createVimExtension(), drawSelection()],
            }),
        }) as EditorView & {
            cm: Parameters<typeof vimModule.Vim.handleKey>[0]
        }

        mountedEditor = view
        view.contentDOM.focus()

        expect(document.activeElement).toBe(view.contentDOM)

        vimModule.Vim.handleKey(view.cm, "y", "user")
        vimModule.Vim.handleKey(view.cm, "y", "user")
        await flushClipboardActions()

        expect(originalWriteTextMock).toHaveBeenCalledTimes(1)
        expect(execCommandMock).toHaveBeenCalledWith("copy")
        expect(document.activeElement).toBe(view.contentDOM)

        vimModule.Vim.mapclear("normal")
        vimModule.Vim.mapclear("visual")
        vimModule.Vim.mapclear("operatorPending")
    })
})
