<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\comment-editor\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论编辑器
-->
<template>
    <div ref="rootRef" class="comment-editor">
        <JEditor ref="jEditorRef" class="comment-main" :state-manager="manager" />
        <el-button class="comment-btn" type="default" @click="run" :loading="loading">{{ btnTextInner }}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { onMounted, ref, useTemplateRef, watch } from "vue"

import { CommentPinnedCode, CommentReviewCode } from "@/api/comment/common"
import { insertCommentAdminAPI, insertCommentAPI, type InsertCommentRequest } from "@/api/comment/insert"
import { updateCommentAdminAPI, updateCommentAPI, type UpdateCommentRequest } from "@/api/comment/update"
import { handleResErr, ResponseCode } from "@/api/response"
import { EditorStateManager, type JEditorRef } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"
import { useEditor } from "@/components/hooks/useEditor"
import { useUserStore } from "@/stores/user"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import { CommentEditorMode, type CommentEditorProps } from "./types"

defineOptions({ name: "CommentEditor" })

// 定义 props
const {
    postId,
    mentions,
    mode = CommentEditorMode.REPLY,
    content,
    isAdmin = false,
    commentId,
    replyToId,
    isPinned = CommentPinnedCode.NotIsPinned,
    reviewCode = CommentReviewCode.Pending,
} = defineProps<CommentEditorProps>()

// 事件
const emit = defineEmits<{
    (event: "comment-insert"): void
    (event: "comment-update"): void
}>()

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

const rootRef = useTemplateRef<HTMLElement>("rootRef")
const jEditorRef = useTemplateRef<JEditorRef>("jEditorRef")

const manager = new EditorStateManager({
    mode: "comment",
    previewShow: false,
    mentions,
})

useEditor(manager)

// 更新 mentions
watch(
    () => mentions,
    (newMentions) => {
        if (!newMentions) return
        manager.setMentions(newMentions)
    },
    { deep: true },
)

// 是否加载中
const loading = ref(false)

// 按钮文字
const computedBtnText = (mode: CommentEditorMode, isLoading: boolean = false) => {
    if (isLoading) {
        return mode === CommentEditorMode.REPLY ? "回复中..." : "更新中..."
    }
    return mode === CommentEditorMode.REPLY ? "回复" : "更新"
}

// 按钮文字
const btnTextInner = ref(computedBtnText(mode))

// 更新编辑器内容
const updateEditor = () => {
    btnTextInner.value = computedBtnText(mode)

    // 如果是回复模式，清空编辑器内容
    if (mode === CommentEditorMode.REPLY) {
        manager.updateState("")
        if (mentions && mentions.length > 0) {
            manager.setMentions(mentions)
        }
        return
    }

    // 如果是编辑模式，更新编辑器内容
    if (content && jEditorRef.value) {
        jEditorRef.value.codemirror.insertContent(content)
    }
}

// 编辑器内容变化时更新编辑器状态
watch(
    () => mode,
    () => {
        updateEditor()
    },
)

// 新增评论
const insertComment = async () => {
    loading.value = true
    btnTextInner.value = computedBtnText(mode, true)
    const contentNew = manager.getState().editorContent

    if (!contentNew) {
        MessageUtil.error("请输入评论内容")
        loading.value = false
        btnTextInner.value = computedBtnText(mode)
        return
    }

    const req: InsertCommentRequest = {
        post_id: postId,
        content: contentNew,
    }
    if (replyToId) {
        req.reply_to_id = replyToId
    }

    let res
    if (isAdmin) {
        res = await insertCommentAdminAPI(req)
    } else {
        res = await insertCommentAPI(req)
    }

    if (res.data.code === ResponseCode.CommentInsertSuccess) {
        const data = res.data.data

        if (data.status === CommentReviewCode.Pending) {
            MessageUtil.warning("评论成功，等待审核", 6000)
        } else if (data.status === CommentReviewCode.Approved) {
            // 轮询后端是否完成
            await pollingGetStreamIDsStatus(data.items)

            // 提示成功
            MessageUtil.success("评论成功", 6000)
        } else if (data.status === CommentReviewCode.Rejected) {
            MessageUtil.error("评论失败，已被管理员拒绝")
        }

        // 清空编辑器
        manager.updateState("")

        emit("comment-insert")
    } else {
        MessageUtil.error(handleResErr(res))
    }

    btnTextInner.value = computedBtnText(mode)
    loading.value = false
}

/* 更新评论
 * @param isAdminReply 是否为管理员回复
 */
const updateComment = async (isAdminReply: boolean = false) => {
    loading.value = true
    btnTextInner.value = computedBtnText(mode, true)
    const contentNew = manager.getState().editorContent

    if (!contentNew) {
        MessageUtil.error("请输入评论内容")
        loading.value = false
        btnTextInner.value = computedBtnText(mode)
        return
    }

    let req: UpdateCommentRequest = {
        id: commentId!,
        is_pinned: isPinned,
        status: reviewCode,
    }

    // 判断内容是否有变化
    if (content !== contentNew) {
        req.content = content
    }

    // 管理员回复时，直接设置为已审核
    if (isAdminReply) {
        req = {
            id: commentId!,
            status: CommentReviewCode.Approved,
        }
    }

    let res
    if (isAdmin) {
        res = await updateCommentAdminAPI(req)
    } else {
        res = await updateCommentAPI(req)
    }

    if (res.data.code === ResponseCode.CommentUpdateSuccess) {
        const data = res.data.data
        // 轮询后端是否完成
        await pollingGetStreamIDsStatus(data.items)

        if (!isAdminReply) {
            // 提示成功
            MessageUtil.success("评论更新成功", 6000)
            // 清空编辑器
            manager.updateState("")

            emit("comment-update")
        }
    } else {
        MessageUtil.error(handleResErr(res))
    }

    btnTextInner.value = computedBtnText(mode)
    loading.value = false
}

const run = async () => {
    if (!isLogin.value) {
        MessageUtil.warning("评论，请先登录。", 6000)
        return
    }

    if (mode === CommentEditorMode.REPLY) {
        if (isAdmin && commentId) {
            await updateComment(true)
        }

        await insertComment()
    } else {
        await updateComment()
    }
}

onMounted(() => {
    // 初始化编辑器内容
    updateEditor()
})

defineExpose({
    root: rootRef,
    editor: jEditorRef,
})
</script>

<style scoped lang="scss">
.comment-editor {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .comment-btn {
        width: 100px;
        height: 38px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 5px;
        color: var(--jpz-text-color-secondary);
    }
}
</style>
