<!--
 * FilePath    : blog-client-nuxt\src\components\views\md\component\page-editor\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面编辑器组件, 封装 Markdown 编辑器实例并提供必要的样式和接口
-->

<!--
 * 补充说明:
 * 图片上传处理器走本地存储 (mdLocalImage): 粘贴/拖拽截图存 IndexedDB 并以 md-img: 引用插入,
 * 匿名可用、不占用服务器; 刷新后由页面级 hydrateLocalImagesForMarkdown 重建 blob URL 注册表;
 * 传入当前内容 getter, 供存储超限时的会话内强制回收判断引用关系
-->

<template>
    <div class="md-page-editor-wrap">
        <JEditor
            :state-manager="stateManager"
            preview-root-class-name="md-page-preview"
            :is-enable-copy-cache="false"
            :placeholder-text="placeholderText"
            :theme="theme"
            :image-upload-handler="localImageUploadHandler"
        />
    </div>
</template>

<script lang="ts" setup>
import type { Extension } from "@codemirror/state"

import JEditor, { type EditorStateManager } from "@/components/editor"
import { createLocalImageUploadHandler } from "@/utils/mdLocalImage"

defineOptions({ name: "MdPageEditor" })

const { stateManager } = defineProps<{
    stateManager: EditorStateManager
    placeholderText: string
    theme: Extension
}>()

// 本地图片上传处理器: setup 只执行一次, 避免内联创建导致每次渲染都产生新函数引用;
// getter 实时读取编辑器当前内容, 供配额超限时的会话内强制回收使用
const localImageUploadHandler = createLocalImageUploadHandler(() => stateManager.getState().editorContent)
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
