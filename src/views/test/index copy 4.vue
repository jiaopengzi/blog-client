<!--
 * FilePath    : blog-client\src\components\common\post-upsert\index.vue
-->
<template>
    <JEditor
        ref="editorPostRef"
        :state-manager="stateManager"
        :is-enable-copy-cache="true"
        :post-id="postInfoForm.id"
        :is-admin-video="true"
        :is-paid="isPaid"
        :pay-strategy="postInfoForm.pay_strategy"
        :price="(postInfoForm.price * 100).toString()"
        :video-toc="postInfoForm.video_toc"
        @update-editor-status="updateEditorStatus"
    />
</template>
<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import { reactive, ref, useTemplateRef } from "vue"

import { EditorStateManager } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"
import { useEditor } from "@/components/hooks/useEditor"
import { useUserStore } from "@/stores/user"

import { type PostUpsertProps, type UpsertPostForm } from "@/components/common/post-upsert/types"
import { createEmptyUpsertPostForm } from "@/components/common/post-upsert/utils"

defineOptions({ name: "PostUpsert" })

const { postType } = defineProps<PostUpsertProps>()

// 初始化表单数据
const postInfoForm = reactive<UpsertPostForm>(createEmptyUpsertPostForm(postType))

const formRef = useTemplateRef<FormInstance>("formRef")

const stateManager = new EditorStateManager()
useEditor(stateManager)

const editorState = stateManager.getState()

const userStore = useUserStore()

const isPaid = ref(false)
const postContentError = ref("")

/**
 * 同步编辑器内容到表单, 并在用户继续编辑时清空上一次 lint 阻断提示.
 * @returns void.
 */
const updateEditorStatus = () => {
    // 将编辑器内容赋值给 post_content
    postInfoForm.post_content = editorState.editorContent
    postContentError.value = ""
    formRef.value?.clearValidate("post_content")
    // 判断文章作者是否为空,如果为空则赋值当前用户id
    if (!postInfoForm.post_author) {
        postInfoForm.post_author = userStore.data.user.id.toString()
    }
}
</script>
