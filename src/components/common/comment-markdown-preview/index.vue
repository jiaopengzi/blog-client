<!--
 * FilePath    : blog-client\src\components\common\comment-markdown-preview\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论markdown预览组件
-->

<template>
    <!-- markdown渲染 -->
    <div class="markdown-preview-container">
        <HtmlPreview
            ref="previewRef"
            :html="state.html"
            :img-urls="state.imgUrls"
            :is-show-el-image-viewer="state.isShowElImageViewer"
            @show-image-viewer="showImageViewer"
            @close-image-viewer="closeImageViewer"
        />
    </div>
</template>

<script lang="ts" setup>
import { EditorStateManager } from "@/components/editor"
import HtmlPreview from "@/components/editor/components/preview"
import { usePreview } from "@/components/editor/hooks/usePreview"

defineOptions({ name: "CommentMarkdownPreview" })

const { markdownContent } = defineProps<{
    markdownContent: string
}>()

// markdown 渲染
const manager = new EditorStateManager({ mode: "comment" })
const state = manager.getState()
const { showImageViewer, closeImageViewer } = usePreview(manager)
manager.updateState(markdownContent)
</script>
<style lang="scss" scoped></style>
