/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\completion\emoji.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : emoji 补全测试
 */

import { CompletionContext } from "@codemirror/autocomplete"
import { EditorState } from "@codemirror/state"
import { describe, expect, it } from "vitest"

import { emojiOverride } from "./emoji"

/**
 * createCompletionContext 创建用于测试 emoji 补全的最小 CompletionContext.
 * @param doc - 当前编辑器文本内容.
 * @returns 指向文档末尾的 CompletionContext.
 */
function createCompletionContext(doc: string): CompletionContext {
    return new CompletionContext(EditorState.create({ doc }), doc.length, false)
}

describe("emojiOverride", () => {
    it("输入 GitHub alias 时会提供对应的 emoji 候选项", () => {
        const result = emojiOverride(createCompletionContext(":smile"))

        expect(result).not.toBeNull()
        expect(result?.from).toBe(0)
        expect(result?.options).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: ":smile: 😄",
                    apply: "😄",
                    detail: "grinning face with smiling eyes",
                }),
            ]),
        )
    })

    it("输入带加号的 GitHub alias 时也会提供对应候选项", () => {
        const result = emojiOverride(createCompletionContext(":+1"))

        expect(result).not.toBeNull()
        expect(result?.options).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: ":+1: 👍",
                    apply: "👍",
                    detail: "thumbs up",
                }),
            ]),
        )
    })

    it("普通文本不触发 emoji 补全", () => {
        expect(emojiOverride(createCompletionContext("smile"))).toBeNull()
    })
})
