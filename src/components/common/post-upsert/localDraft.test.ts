/**
 * FilePath    : blog-client\src\components\common\post-upsert\localDraft.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : post-upsert 本地草稿工具测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { CommentStatusCode, PayStrategy, PostStatusCode, PostType } from "@/api/post/common"
import { LocalStorageKey } from "@/stores/local"

import {
    clearPostUpsertLocalDraft,
    getPostUpsertDraftSignature,
    getPostUpsertLocalDraftKey,
    loadPostUpsertLocalDraft,
    normalizePostUpsertDraftForm,
    resolvePostUpsertLocalDraftConflict,
    savePostUpsertLocalDraft,
} from "./localDraft"
import type { UpsertPostForm } from "./types"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

/**
 * createForm 创建测试用文章编辑表单.
 * @param partial - 需要覆盖的局部字段.
 * @returns 完整文章编辑表单.
 */
function createForm(partial: Partial<UpsertPostForm> = {}): UpsertPostForm {
    return {
        id: "",
        post_author: "1",
        post_content: "# hello",
        post_title: "hello",
        post_status: PostStatusCode.Draft,
        post_password: "",
        comment_status: CommentStatusCode.Open,
        price: 0,
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        slug: "",
        thumbnail: "",
        category_ids: ["1"],
        tag_names: ["tag"],
        pay_roles: [],
        pay_strategy: PayStrategy.Buy,
        post_push_time: {
            Time: null,
            Valid: false,
        },
        post_expired_time: {
            Time: null,
            Valid: false,
        },
        is_pinned: 0,
        is_recommended: 0,
        post_type: PostType.Post,
        video_toc: [],
        video_file_id_hash_list: [],
        ...partial,
    }
}

describe("post-upsert localDraft storage", () => {
    it("按文章类型和 ID 保存并读取本地草稿", () => {
        const form = createForm({ id: "100" })
        const saved = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "100", form, remoteSaved: false })

        expect(saved.saved).toBe(true)
        expect(loadPostUpsertLocalDraft(PostType.Post, "100")).toEqual(saved.draft)
        expect(getPostUpsertLocalDraftKey(PostType.Post, "100")).toBe("post:100")
    })

    it("新增文章使用稳定的新建草稿键", () => {
        const form = createForm()
        savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form, remoteSaved: false })

        expect(loadPostUpsertLocalDraft(PostType.Post, "")?.postId).toBe("__new__")
        expect(getPostUpsertLocalDraftKey(PostType.Post, "")).toBe("post:__new__")
    })

    it("内容签名未变化时跳过 localStorage 写入", () => {
        const form = createForm()
        const first = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form, remoteSaved: false })
        const rawBefore = localStorage.getItem(LocalStorageKey.PostUpsertDrafts)
        const second = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form, remoteSaved: false, lastSavedSignature: first.signature })
        const rawAfter = localStorage.getItem(LocalStorageKey.PostUpsertDrafts)

        expect(second.saved).toBe(false)
        expect(rawAfter).toBe(rawBefore)
    })

    it("force 为 true 时即使签名相同也会更新远端保存标志", () => {
        const form = createForm()
        const first = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form, remoteSaved: false })

        savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form, remoteSaved: true, lastSavedSignature: first.signature, force: true })

        expect(loadPostUpsertLocalDraft(PostType.Post, "")?.remoteSaved).toBe(true)
    })

    it("清理后不再读取本地草稿", () => {
        savePostUpsertLocalDraft({ postType: PostType.Post, postId: "100", form: createForm({ id: "100" }), remoteSaved: false })

        clearPostUpsertLocalDraft(PostType.Post, "100")

        expect(loadPostUpsertLocalDraft(PostType.Post, "100")).toBeNull()
        expect(localStorage.getItem(LocalStorageKey.PostUpsertDrafts)).toBeNull()
    })

    it("清理单个草稿时应保留其他文章草稿", () => {
        savePostUpsertLocalDraft({ postType: PostType.Post, postId: "100", form: createForm({ id: "100" }), remoteSaved: false })
        savePostUpsertLocalDraft({ postType: PostType.Post, postId: "200", form: createForm({ id: "200" }), remoteSaved: false })

        clearPostUpsertLocalDraft(PostType.Post, "100")

        expect(loadPostUpsertLocalDraft(PostType.Post, "100")).toBeNull()
        expect(loadPostUpsertLocalDraft(PostType.Post, "200")).not.toBeNull()
    })

    it("非法 JSON 和非法结构不会返回本地草稿", () => {
        localStorage.setItem(LocalStorageKey.PostUpsertDrafts, "{")
        expect(loadPostUpsertLocalDraft(PostType.Post, "100")).toBeNull()

        localStorage.setItem(LocalStorageKey.PostUpsertDrafts, JSON.stringify({ "post:100": { version: 999 } }))
        expect(loadPostUpsertLocalDraft(PostType.Post, "100")).toBeNull()
    })

    it("读取本地草稿时会恢复日期字段为 Date", () => {
        const form = createForm({
            post_push_time: {
                Time: new Date("2026-05-26T08:00:00.000Z"),
                Valid: true,
            },
        })
        savePostUpsertLocalDraft({ postType: PostType.Post, postId: "100", form, remoteSaved: false })

        const draft = loadPostUpsertLocalDraft(PostType.Post, "100")

        expect(draft?.form.post_push_time.Time).toBeInstanceOf(Date)
        expect(draft?.form.post_push_time.Valid).toBe(true)
    })
})

describe("resolvePostUpsertLocalDraftConflict", () => {
    it("没有本地草稿时无需提示", () => {
        expect(resolvePostUpsertLocalDraftConflict(null, createForm())).toBe("none")
    })

    it("新增文章草稿已远端保存时无需恢复提示", () => {
        const form = createForm({ post_title: "local" })
        const { draft } = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form, remoteSaved: true })

        expect(resolvePostUpsertLocalDraftConflict(draft, createForm())).toBe("none")
    })

    it("编辑文章草稿已远端保存时无需恢复提示", () => {
        const form = createForm({ id: "100", post_title: "local" })
        const { draft } = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "100", form, remoteSaved: true })

        expect(resolvePostUpsertLocalDraftConflict(draft, createForm({ id: "100", post_title: "remote" }))).toBe("none")
    })

    it("新增文章存在未远端保存且不同的草稿时需要提示", () => {
        const { draft } = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "", form: createForm({ post_title: "local" }), remoteSaved: false })

        expect(resolvePostUpsertLocalDraftConflict(draft, createForm({ post_title: "" }))).toBe("prompt")
    })

    it("编辑文章远端表单与本地草稿不一致时需要提示", () => {
        const { draft } = savePostUpsertLocalDraft({
            postType: PostType.Post,
            postId: "100",
            form: createForm({ id: "100", post_title: "local" }),
            remoteSaved: false,
        })

        expect(resolvePostUpsertLocalDraftConflict(draft, createForm({ id: "100", post_title: "remote" }))).toBe("prompt")
    })

    it("编辑文章远端表单与本地草稿一致时无需提示", () => {
        const form = createForm({ id: "100", post_title: "same" })
        const { draft } = savePostUpsertLocalDraft({ postType: PostType.Post, postId: "100", form, remoteSaved: false })

        expect(resolvePostUpsertLocalDraftConflict(draft, form)).toBe("none")
    })

    it("表单签名会忽略响应式对象顺序差异并保持稳定", () => {
        const form = createForm({ post_expired_time: { Time: new Date("2026-05-27T08:00:00.000Z"), Valid: true } })

        expect(getPostUpsertDraftSignature(form)).toBe(JSON.stringify(normalizePostUpsertDraftForm(form)))
    })
})
