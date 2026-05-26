/**
 * FilePath    : blog-client\src\views\md\localDraft.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公用 Markdown 页面本地草稿工具单元测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { clearPublicMdDraft, loadPublicMdDraft, savePublicMdDraft } from "./localDraft"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

describe("savePublicMdDraft + loadPublicMdDraft", () => {
    it("保存后可以正确读取公用 Markdown 草稿", () => {
        const saved = savePublicMdDraft("# hello")
        const loaded = loadPublicMdDraft()

        expect(loaded).toEqual(saved)
    })

    it("读取到非法 JSON 时返回 null", () => {
        localStorage.setItem("public_md_draft", "{")

        expect(loadPublicMdDraft()).toBeNull()
    })
})

describe("clearPublicMdDraft", () => {
    it("清空后不再返回已保存草稿", () => {
        savePublicMdDraft("# hello")

        clearPublicMdDraft()

        expect(loadPublicMdDraft()).toBeNull()
    })
})