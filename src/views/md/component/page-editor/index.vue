<!--
 * FilePath    : blog-client\src\views\md\component\page-editor\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面编辑器组件，封装 Markdown 编辑器实例并提供必要的样式和接口.
-->

<template>
    <div class="md-page-editor-wrap">
        <JEditor
            :state-manager="stateManager"
            preview-root-class-name="md-page-preview"
            :is-enable-copy-cache="false"
            :placeholder-text="placeholderText"
            :theme="theme"
            :image-upload-handler="null"
        />
    </div>
</template>

<script lang="ts" setup>
import type { Extension } from "@codemirror/state"

import JEditor, { type EditorStateManager } from "@/components/editor"

defineOptions({ name: "MdPageEditor" })

defineProps<{
    stateManager: EditorStateManager
    placeholderText: string
    theme: Extension
}>()
</script>

<style scoped lang="scss">
.md-page-editor-wrap {
    position: relative;
    min-height: 0;
    overflow: hidden;
}

.md-page-editor-wrap :deep(.md-layout) {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    background: transparent;
}

.md-page-editor-wrap :deep(.md-toolbar) {
    flex: 0 0 auto;
    margin-bottom: 10px;
}

.md-page-editor-wrap :deep(.md-container),
.md-page-editor-wrap :deep(.md-container-comment) {
    min-height: 0;
    height: 100% !important;
}

.md-page-editor-wrap :deep(.md-toc),
.md-page-editor-wrap :deep(.md-editor),
.md-page-editor-wrap :deep(.md-preview) {
    height: 100% !important;
}

.md-page-editor-wrap :deep(.md-editor) {
    --md-editor-height: 100%;
}

.md-page-editor-wrap :deep(#jpz-codemirror),
.md-page-editor-wrap :deep(#preview),
.md-page-editor-wrap :deep(#preview-copy),
.md-page-editor-wrap :deep(.cm-editor),
.md-page-editor-wrap :deep(.cm-scroller) {
    height: 100% !important;
}
</style>
