<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\comment-editor\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论编辑器
-->
<template>
    <div class="comment-editor">
        <JEditor class="comment-main" :state-manager="manager" />
        <el-button class="comment-btn" type="default" @click="insertComment" :loading="loading">{{ btnTextInner }}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import { CommentReviewCode } from "@/api/comment/common"
import { insertCommentAPI, type InsertCommentRequest } from "@/api/comment/insert"
import { handleResErr, ResponseCode } from "@/api/response"
import JEditor, { EditorStateManager } from "@/components/editor"
import { useEditor } from "@/components/hooks/useEditor"
import { MessageUtil } from "@/utils/message"

import type { CommentEditorProps } from "./types"

defineOptions({ name: "EditorAll" })

// 定义 props
const { postId, mentions } = defineProps<CommentEditorProps>()

// 事件
const emit = defineEmits<{
    (event: "comment-update"): void
}>()

const manager = new EditorStateManager({
    mode: "comment",
    previewShow: false,
    mentions,
})

useEditor(manager)

watch(
    () => mentions,
    (newMentions) => {
        // // @提及示例
        // manager.setMentions([
        //     { label: "@jiaopengzi", apply: "[@jiaopengzi](id123)" },
        //     { label: "@焦棚子", apply: "[@焦棚子](id122)" },
        // ])
        if (!newMentions) return
        manager.setMentions(newMentions)
    },
    { immediate: true },
)

// 是否加载中
const loading = ref(false)

// 按钮文字
const btnTextInner = ref("提交")

// 提交评论
const insertComment = async () => {
    loading.value = true
    btnTextInner.value = "提交中..."
    const content = manager.getState().editorContent

    if (!content) {
        MessageUtil.error("请输入评论内容")
        loading.value = false
        btnTextInner.value = "提交"
        return
    }

    const req: InsertCommentRequest = {
        post_id: postId,
        content,
    }

    const res = await insertCommentAPI(req)
    if (res.data.code === ResponseCode.CommentInsertSuccess) {
        const data = res.data.data

        if (data.status === CommentReviewCode.Pending) {
            MessageUtil.warning("评论成功，等待审核", 6000)
        } else if (data.status === CommentReviewCode.Approved) {
            MessageUtil.success("评论成功", 6000)
        } else if (data.status === CommentReviewCode.Rejected) {
            MessageUtil.error("评论失败，已被管理员拒绝")
        }

        emit("comment-update")
    } else {
        MessageUtil.error(handleResErr(res))
    }

    btnTextInner.value = "提交"
    loading.value = false
}
</script>

<style scoped lang="scss">
.comment-editor {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .comment-btn {
        width: 65px;
        height: 40px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 5px;
        color: var(--jpz-text-color-secondary);
    }
}
</style>
