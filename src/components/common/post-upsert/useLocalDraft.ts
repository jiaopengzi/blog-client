/*
 * FilePath    : blog-client\src\components\common\post-upsert\useLocalDraft.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章编辑器本地草稿状态管理
 */

import { ElMessageBox, type FormInstance } from "element-plus"
import { nextTick, reactive, ref, type Reactive, type Ref } from "vue"

import { CommentStatusCode, PostType } from "@/api/post/common"
import type { SwitchItem } from "@/components/common/switch-group"
import { EditorStateManager } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"

import {
    clearPostUpsertLocalDraft,
    getPostUpsertDraftSignature,
    loadPostUpsertLocalDraft,
    resolvePostUpsertLocalDraftConflict,
    savePostUpsertLocalDraft,
    type PostUpsertLocalDraft,
} from "./localDraft"
import type { UpsertPostForm } from "./types"

type LocalDraftStatusType = "idle" | "saved" | "error" | "conflict"

export interface LocalDraftStatus {
    text: string
    type: LocalDraftStatusType
}

export interface UsePostUpsertLocalDraftOptions {
    postType: PostType
    postInfoForm: Reactive<UpsertPostForm>
    stateManager: EditorStateManager
    editorPostRef: Readonly<Ref<InstanceType<typeof JEditor> | null>>
    formRef: Readonly<Ref<FormInstance | undefined | null>>
    commentStatus: SwitchItem[]
    postShowMethod: SwitchItem[]
    rolePaidList: SwitchItem[]
    isUpdate: Ref<boolean>
    updateStatus: () => void
}

/**
 * usePostUpsertLocalDraft 管理文章编辑器本地草稿的保存, 恢复, 冲突提示与状态展示.
 * @param options - 本地草稿所需的表单, 编辑器, 开关项与快照状态.
 * @returns 本地草稿状态与生命周期方法.
 */
export function usePostUpsertLocalDraft(options: UsePostUpsertLocalDraftOptions) {
    const localDraftStatus = reactive<LocalDraftStatus>({
        text: "",
        type: "idle",
    })
    const isApplyingLocalDraft = ref(false)
    let localDraftLastSavedSignature = getPostUpsertDraftSignature(options.postInfoForm)
    let localDraftAutoSaveTimer: number | undefined

    /**
     * resetLocalDraftStatus 隐藏本地草稿提示, 表示当前远端与本地编辑内容一致.
     * @returns void.
     */
    const resetLocalDraftStatus = (): void => {
        localDraftStatus.text = ""
        localDraftStatus.type = "idle"
    }

    /**
     * setLocalDraftSavedStatus 根据草稿更新时间刷新页面上的本地保存状态.
     * @param draft - 已保存或已恢复的本地草稿.
     * @returns void.
     */
    const setLocalDraftSavedStatus = (draft: PostUpsertLocalDraft): void => {
        localDraftStatus.text = `本地已保存 ${formatLocalDraftUpdatedAt(draft.updatedAt)}`
        localDraftStatus.type = "saved"
    }

    /**
     * syncSwitchItemsFromPostForm 将恢复后的表单布尔字段同步回 SwitchGroup 状态.
     * @returns void.
     */
    const syncSwitchItemsFromPostForm = (): void => {
        options.commentStatus[0]!.status = options.postInfoForm.comment_status === CommentStatusCode.Open
        options.postShowMethod.forEach((item) => {
            item.status = Boolean((options.postInfoForm as unknown as Record<string, number>)[item.name])
        })
        options.rolePaidList.forEach((item) => {
            item.status = options.postInfoForm.pay_roles.includes(item.name)
        })
    }

    /**
     * applyPostUpsertLocalDraft 将用户选择的本地草稿回填到表单与编辑器.
     * @param draft - 需要恢复的本地草稿.
     * @returns void.
     */
    const applyPostUpsertLocalDraft = async (draft: PostUpsertLocalDraft): Promise<void> => {
        isApplyingLocalDraft.value = true
        try {
            Object.assign(options.postInfoForm, draft.form)
            options.stateManager.setInitDocIsEmpty(!draft.form.post_content)
            options.editorPostRef.value?.replaceContent(draft.form.post_content)
            if (!options.editorPostRef.value) {
                options.stateManager.updateState(draft.form.post_content)
            }
            await nextTick()
            options.editorPostRef.value?.replaceContent(draft.form.post_content)
            syncSwitchItemsFromPostForm()
            options.updateStatus()
            options.formRef.value?.clearValidate()
            localDraftLastSavedSignature = draft.formSignature
            setLocalDraftSavedStatus(draft)
        } finally {
            await nextTick()
            isApplyingLocalDraft.value = false
        }
    }

    /**
     * clearPostUpsertLocalDraftAfterRemoteSaved 清理已成功保存到远端的本地草稿.
     * @param postId - 需要清理的草稿 ID, 新增文章保存前为空字符串.
     * @returns void.
     */
    const clearPostUpsertLocalDraftAfterRemoteSaved = (postId = options.postInfoForm.id || ""): void => {
        try {
            clearPostUpsertLocalDraft(options.postType, postId)
            if (postId !== options.postInfoForm.id) {
                clearPostUpsertLocalDraft(options.postType, options.postInfoForm.id)
            }
            localDraftLastSavedSignature = getPostUpsertDraftSignature(options.postInfoForm)
            resetLocalDraftStatus()
        } catch (error) {
            console.error("清理文章本地草稿失败", error)
            localDraftStatus.text = "本地草稿清理失败"
            localDraftStatus.type = "error"
        }
    }

    /**
     * resolvePostUpsertLocalDraftOnMount 在页面初始化后处理本地草稿冲突.
     * @returns void.
     */
    const resolvePostUpsertLocalDraftOnMount = async (): Promise<void> => {
        const draftPostId = options.postInfoForm.id || ""
        const isCreateMode = !draftPostId
        const draft = loadPostUpsertLocalDraft(options.postType, draftPostId)
        const currentSignature = getPostUpsertDraftSignature(options.postInfoForm)
        localDraftLastSavedSignature = currentSignature

        const resolution = resolvePostUpsertLocalDraftConflict(draft, options.postInfoForm)
        if (!draft || resolution === "none") {
            if (draft) {
                clearPostUpsertLocalDraft(options.postType, draftPostId)
            }
            resetLocalDraftStatus()
            return
        }

        localDraftStatus.text = "发现本地草稿冲突"
        localDraftStatus.type = "conflict"

        try {
            await ElMessageBox.confirm(
                isCreateMode
                    ? `检测到上次未成功保存的本地草稿, 最近保存于 ${formatLocalDraftUpdatedAt(draft.updatedAt)}, 是否恢复?`
                    : `本地草稿与远端内容不一致, 本地最近保存于 ${formatLocalDraftUpdatedAt(draft.updatedAt)}, 是否使用本地草稿?`,
                "本地草稿冲突",
                {
                    confirmButtonText: "恢复本地草稿",
                    cancelButtonText: isCreateMode ? "放弃草稿" : "使用远端内容",
                    type: "warning",
                },
            )
            await applyPostUpsertLocalDraft(draft)
        } catch {
            clearPostUpsertLocalDraft(options.postType, draftPostId)
            localDraftLastSavedSignature = currentSignature
            resetLocalDraftStatus()
        }
    }

    /**
     * persistPostUpsertLocalDraftIfChanged 按当前快照状态保存本地草稿.
     * @returns void.
     */
    const persistPostUpsertLocalDraftIfChanged = (): void => {
        const draftPostId = options.postInfoForm.id || ""
        const currentSignature = getPostUpsertDraftSignature(options.postInfoForm)

        if (!options.isUpdate.value) {
            const draft = loadPostUpsertLocalDraft(options.postType, draftPostId)
            if (draft && !draft.remoteSaved) {
                clearPostUpsertLocalDraft(options.postType, draftPostId)
            }
            localDraftLastSavedSignature = currentSignature
            resetLocalDraftStatus()
            return
        }

        if (currentSignature === localDraftLastSavedSignature) {
            return
        }

        try {
            const result = savePostUpsertLocalDraft({
                postType: options.postType,
                postId: draftPostId,
                form: options.postInfoForm,
                remoteSaved: false,
                lastSavedSignature: localDraftLastSavedSignature,
            })
            localDraftLastSavedSignature = result.signature
            if (result.saved) {
                setLocalDraftSavedStatus(result.draft)
            }
        } catch (error) {
            console.error("保存文章本地草稿失败", error)
            localDraftStatus.text = "本地保存失败, 请检查浏览器存储空间"
            localDraftStatus.type = "error"
        }
    }

    /**
     * startPostUpsertLocalDraftAutoSave 启动文章编辑器本地草稿定时保存.
     * @returns void.
     */
    const startPostUpsertLocalDraftAutoSave = (): void => {
        stopPostUpsertLocalDraftAutoSave()
        localDraftAutoSaveTimer = window.setInterval(persistPostUpsertLocalDraftIfChanged, 1000)
    }

    /**
     * stopPostUpsertLocalDraftAutoSave 停止文章编辑器本地草稿定时保存.
     * @returns void.
     */
    const stopPostUpsertLocalDraftAutoSave = (): void => {
        if (localDraftAutoSaveTimer === undefined) {
            return
        }

        window.clearInterval(localDraftAutoSaveTimer)
        localDraftAutoSaveTimer = undefined
    }

    return {
        localDraftStatus,
        isApplyingLocalDraft,
        clearPostUpsertLocalDraftAfterRemoteSaved,
        resolvePostUpsertLocalDraftOnMount,
        startPostUpsertLocalDraftAutoSave,
        stopPostUpsertLocalDraftAutoSave,
    }
}

/**
 * formatLocalDraftUpdatedAt 格式化本地草稿更新时间.
 * @param updatedAt - 本地草稿更新时间 ISO 字符串.
 * @returns 可直接展示的中文时间.
 */
function formatLocalDraftUpdatedAt(updatedAt: string): string {
    return new Date(updatedAt).toLocaleString("zh-CN", { hour12: false })
}
