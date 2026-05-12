/**
 * FilePath    : blog-client\src\utils\clipboard\copy-html.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : copyHtml 函数的单元测试，验证在不同环境下正确使用现代 Clipboard API 或回退到 execCommand 模式。
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { copyHtml } from "./copy-html"

describe("copyHtml", () => {
    const originalClipboard = navigator.clipboard
    const originalClipboardItem = globalThis.ClipboardItem
    const originalExecCommand = document.execCommand

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: originalClipboard,
        })

        if (originalClipboardItem) {
            vi.stubGlobal("ClipboardItem", originalClipboardItem)
        }

        Object.defineProperty(document, "execCommand", {
            configurable: true,
            value: originalExecCommand,
        })
    })

    it("支持现代 Clipboard API 时返回 modern 模式", async () => {
        const writeMock = vi.fn(async () => undefined)

        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: { write: writeMock },
        })
        vi.stubGlobal(
            "ClipboardItem",
            class ClipboardItemMock {
                constructor(public readonly data: Record<string, Blob>) {}
                static supports(): boolean {
                    return true
                }
            } as unknown as typeof ClipboardItem,
        )

        const result = await copyHtml("<p>hello</p>")

        expect(result).toEqual({ method: "modern" })
        expect(writeMock).toHaveBeenCalledTimes(1)
    })

    it("现代 Clipboard API 不可用时回退到 execCommand 模式", async () => {
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: undefined,
        })

        const execCommandMock = vi.fn(() => true)
        Object.defineProperty(document, "execCommand", {
            configurable: true,
            value: execCommandMock,
        })

        const result = await copyHtml("<h1>标题</h1>")

        expect(result).toEqual({ method: "execCommand" })
        expect(execCommandMock).toHaveBeenCalledWith("copy")
    })
})
