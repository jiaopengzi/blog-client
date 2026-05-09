/**
 * @FilePath     : \blog-client\src\components\editor\command\insert.test.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : markdown 插入命令测试
 */

import { afterEach, describe, expect, it } from "vitest"

import { CommandsKey, editorInsertFormatContent, markdownEditorCommands } from "@/components/editor/command"
import { EditorState, EditorView } from "@/pkg/codemirror"

describe("editorInsertFormatContent", () => {
    afterEach(() => {
        document.body.innerHTML = ""
    })

    it("插入 Details 模板时, 光标停留在内容区域起始位置", () => {
        const parent = document.createElement("div")
        document.body.appendChild(parent)

        const view = new EditorView({
            state: EditorState.create({ doc: "" }),
            parent,
        })

        editorInsertFormatContent(view, markdownEditorCommands[CommandsKey.Details])

        expect(view.state.doc.toString()).toBe("\n<details><summary>Details</summary>\n<p>\n\n</p>\n</details>\n")
        expect(view.state.selection.main.from).toBe(markdownEditorCommands[CommandsKey.Details].prefix?.length ?? 0)

        view.destroy()
    })
})
