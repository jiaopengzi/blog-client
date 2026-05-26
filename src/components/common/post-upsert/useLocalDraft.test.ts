/**
 * FilePath    : blog-client\src\components\common\post-upsert\useLocalDraft.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : post-upsert 本地草稿实时保存状态测试
 */

import { effectScope, nextTick, reactive, ref } from "vue"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CommentStatusCode, PayStrategy, PostStatusCode, PostType } from "@/api/post/common"
import type { SwitchItem } from "@/components/common/switch-group"
import type { EditorStateManager } from "@/components/editor"
import { LocalStorageKey } from "@/stores/local"

import { getPostUpsertDraftSignature, loadPostUpsertLocalDraft } from "./localDraft"
import type { UpsertPostForm } from "./types"
import { usePostUpsertLocalDraft } from "./useLocalDraft"

beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
})

afterEach(() => {
    vi.useRealTimers()
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

/**
 * createLocalDraftContext 创建本地草稿组合式函数测试上下文.
 * @returns 表单, 草稿管理器和销毁函数.
 */
function createLocalDraftContext() {
    const form = reactive(createForm())
    const initialSignature = getPostUpsertDraftSignature(form)
    const isUpdate = ref(false)
    const updateStatus = vi.fn(() => {
        isUpdate.value = getPostUpsertDraftSignature(form) !== initialSignature
    })
    const scope = effectScope()
    const stateManager = {
        setInitDocIsEmpty: vi.fn(),
        updateState: vi.fn(),
    } as unknown as EditorStateManager
    const switchItems: SwitchItem[] = [{ name: "is_pinned", status: false }]

    const localDraft = scope.run(() =>
        usePostUpsertLocalDraft({
            postType: PostType.Post,
            postInfoForm: form,
            stateManager,
            editorPostRef: ref(null),
            formRef: ref(null),
            commentStatus: [{ name: "comment_status", status: true }],
            postShowMethod: switchItems,
            rolePaidList: [],
            isUpdate,
            updateStatus,
        }),
    )!

    return {
        form,
        localDraft,
        start: () => scope.run(() => localDraft.startPostUpsertLocalDraftRealtimeSave()),
        stop: () => scope.stop(),
    }
}

describe("usePostUpsertLocalDraft realtime save", () => {
    it("表单变化后按防抖节奏保存本地草稿, 不再启动 1 秒轮询", async () => {
        const setIntervalSpy = vi.spyOn(window, "setInterval")
        const { form, localDraft, start, stop } = createLocalDraftContext()

        start()
        form.post_title = "changed"
        await nextTick()
        await nextTick()

        await vi.advanceTimersByTimeAsync(399)
        expect(loadPostUpsertLocalDraft(PostType.Post, "")).toBeNull()

        await vi.advanceTimersByTimeAsync(1)
        expect(loadPostUpsertLocalDraft(PostType.Post, "")?.form.post_title).toBe("changed")
        expect(setIntervalSpy).not.toHaveBeenCalled()

        localDraft.stopPostUpsertLocalDraftRealtimeSave()
        stop()
        setIntervalSpy.mockRestore()
    })

    it("停止实时保存时会取消尚未执行的防抖保存", async () => {
        const { form, localDraft, start, stop } = createLocalDraftContext()

        start()
        form.post_title = "changed"
        await nextTick()
        await nextTick()
        localDraft.stopPostUpsertLocalDraftRealtimeSave()

        await vi.advanceTimersByTimeAsync(400)

        expect(localStorage.getItem(LocalStorageKey.PostUpsertDrafts)).toBeNull()
        stop()
    })

    it("内容回到远端快照时会清理未远端保存草稿", async () => {
        const { form, start, stop } = createLocalDraftContext()

        start()
        form.post_title = "changed"
        await nextTick()
        await nextTick()
        await vi.advanceTimersByTimeAsync(400)
        expect(loadPostUpsertLocalDraft(PostType.Post, "")).not.toBeNull()

        form.post_title = "hello"
        await nextTick()
        await nextTick()
        await vi.advanceTimersByTimeAsync(400)

        expect(loadPostUpsertLocalDraft(PostType.Post, "")).toBeNull()
        stop()
    })
})
