<!--
 * FilePath    : blog-client\src\views\admin\component\main\comment\edit-reply\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论编辑和回复
-->

<template>
    <CommentItem
        :data="data"
        :post-id="postId"
        :status="commentStatus"
        :is-show-edit-btn="true"
        :is-admin="true"
        @reply="handleReply"
        @delete="handleDelete"
        @pinned="handlePinned"
        @edit="handleEdit"
    />
    <!-- 评论审核状态 -->
    <el-radio-group v-if="editorMode === CommentEditorMode.EDIT" v-model="commentReviewStatus" class="comment-status">
        <el-radio :value="CommentReviewCode.Pending">{{ CommentStatusDisplay[CommentReviewCode.Pending] }}</el-radio>
        <el-radio :value="CommentReviewCode.Approved">{{ CommentStatusDisplay[CommentReviewCode.Approved] }}</el-radio>
        <el-radio :value="CommentReviewCode.Rejected">{{ CommentStatusDisplay[CommentReviewCode.Rejected] }}</el-radio>
    </el-radio-group>

    <CommentEditor
        :mode="editorMode"
        :post-id="postId"
        :mentions="mentionsAc"
        :content="data.content"
        :is-admin="true"
        :comment-id="data.id"
        :is-pinned="data.is_pinned"
        :review-code="commentReviewStatus"
        @comment-insert="handleInsert"
        @comment-update="handleUpdate"
    />
</template>

<script lang="ts" setup>
import type { Completion } from "@codemirror/autocomplete"
import { onMounted, ref } from "vue"

import { type CommentRes, CommentReviewCode, CommentStatusDisplay } from "@/api/comment/common"
import CommentEditor, { CommentEditorMode } from "@/views/home/main-content/post-detail/components/comment-editor"
import CommentItem from "@/views/home/main-content/post-detail/components/comment-list/comment-item"

import { type EditReplyProps } from "./types"

defineOptions({ name: "CommentEditReply" })

// 定义 props
const { data, postId, mentions, commentStatus } = defineProps<EditReplyProps>()

// 事件
const emit = defineEmits<{
    (event: "complete-reply"): void
    (event: "complete-edit"): void
}>()

const commentReviewStatus = ref<CommentReviewCode>(data.status)

// 是否显示编辑器
const editorMode = ref<CommentEditorMode>(CommentEditorMode.REPLY)

const handleReply = () => {
    editorMode.value = CommentEditorMode.REPLY
}

const handleDelete = () => {
    emit("complete-edit")
}
const handlePinned = () => {
    emit("complete-edit")
}

const handleEdit = (data: CommentRes) => {
    editorMode.value = CommentEditorMode.EDIT
}

const handleInsert = () => {
    emit("complete-reply")
}

const handleUpdate = () => {
    emit("complete-edit")
}

// 更新 mentions
const mentionsAc = ref<Completion[]>([])
onMounted(() => {
    mentionsAc.value = mentions
})
</script>
<style lang="scss" scoped>
// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
