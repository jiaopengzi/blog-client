<!--
 * FilePath    : blog-client\src\views\md\component\md-customizer\editor-panel\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义样式编辑面板组件，封装 CodeMirror 实例并提供必要的接口与样式.
-->

<template>
    <main class="md-customizer-editor">
        <div class="md-customizer-editor-header">
            <div>
                <span class="md-customizer-editor-label">自定义 CSS</span>
                <p class="md-customizer-editor-tip">左侧配置会同步到自动编辑器中, 你可以继续在编辑器中手动调整.</p>
            </div>
            <el-button size="small" text @click="emitInsertCssExample">插入示例</el-button>
        </div>
        <div class="md-customizer-editor-wrap">
            <EditorCodemirror
                ref="editorRef"
                :create-setup="createCssSetup"
                :doc="doc"
                :height="editorHeight"
                :init-doc-is-empty="false"
                @update-editor-doc="emitUpdateEditorDoc"
            />
        </div>
    </main>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue"

import EditorCodemirror from "@/components/editor/components/codemirror/index.vue"
import { createCssSetup } from "@/pkg/codemirror"

defineOptions({ name: "MdCustomizerEditorPanel" })

const props = defineProps<{
    doc: string
    editorHeight: string
}>()

const emit = defineEmits<{
    (event: "update-editor-doc", doc: string): void
    (event: "insert-css-example"): void
}>()

const editorRef = ref<InstanceType<typeof EditorCodemirror> | null>(null)

/**
 * @description: 将最新文档内容同步到右侧 CodeMirror 实例.
 * @param nextDoc 需要回填到编辑器的完整 CSS 文档.
 * @return 无返回值.
 */
function syncDocToEditor(nextDoc: string): void {
    void nextTick(() => {
        editorRef.value?.replaceContent(nextDoc)
    })
}

/**
 * @description: 将右侧编辑器的最新文本抛给容器层处理.
 * @param nextDoc 编辑器中的完整 CSS 文档.
 * @return 无返回值.
 */
function emitUpdateEditorDoc(nextDoc: string): void {
    emit("update-editor-doc", nextDoc)
}

/**
 * @description: 通知容器层向手动区插入 CSS 示例.
 * @return 无返回值.
 */
function emitInsertCssExample(): void {
    emit("insert-css-example")
}

watch(
    () => props.doc,
    (nextDoc) => {
        syncDocToEditor(nextDoc)
    },
    { immediate: true },
)
</script>

<style lang="scss" scoped>
.md-customizer-editor {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.md-customizer-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px 10px;
    flex-shrink: 0;
}

.md-customizer-editor-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--jpz-text-color-regular);
}

.md-customizer-editor-tip {
    margin: 4px 0 0;
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
    line-height: 1.5;
}

.md-customizer-editor-wrap {
    flex: 1;
    min-height: 0;
    padding: 0 12px 12px;
    overflow: hidden;

    :deep(#jpz-codemirror) {
        height: 100% !important;
    }

    :deep(.cm-editor) {
        height: 100% !important;
        border-radius: 12px;
        border: 1px solid var(--jpz-border-color);
        background: color-mix(in srgb, var(--jpz-bg-color) 96%, white 4%);
    }

    :deep(.cm-scroller) {
        overflow: auto !important;
    }
}

@include respond-to("phone") {
    .md-customizer-editor-header {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
