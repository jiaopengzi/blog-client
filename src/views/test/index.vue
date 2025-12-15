<template>
    <!-- 编辑器 -->
    <div class="md-editor md-container-item">
        <EditorCodemirror
            ref="codemirrorRef"
            :create-setup="createCssSetup"
            :doc="userCSSString"
            width="400"
            height="400"
            @update-editor-doc="updateEditorDoc"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import EditorCodemirror from "@/components/editor/components/codemirror"
import { createCssSetup, type CreateSetupType } from "@/pkg/codemirror"
import { isValidCSS } from "@/utils/cssValidator"

defineOptions({ name: "MyTest" })

/* 用户自定义 CSS */
const userCSSString = ref(`
html ::-webkit-scrollbar-thumb {
  background-color: #cccccc;
}

@media (min-width: 1220px) {
  html ::-webkit-scrollbar {
    width: 10px;
    height: 12px;
  }
}

.md-toc h4:hover,
.md-toc h5:hover,
.md-toc h6:hover {
  text-decoration: underline;
}
`)

// 处理输入事件
const handleInput = (event: Event) => {
    const target = event.target as HTMLElement
    userCSSString.value = target.innerText || target.textContent || ""

    // 验证CSS
    const { isValid, errors } = isValidCSS(userCSSString.value)
    if (isValid) {
        console.info("good css")
    } else {
        console.error("Errors:", "\n" + errors.join("\n"))
    }
}

const updateEditorDoc = (editorDoc: string) => {
    console.log("============>editorDoc", editorDoc)
}
</script>

<style scoped lang="scss">
.editable-div {
    width: 300px;
    height: 200px;
    background-color: #f0f0f0;
    overflow: auto;
    padding: 10px;
    white-space: pre;
    border: 1px solid #ccc;
    outline: none;

    /* 保持代码高亮样式 */
    :deep(.hljs) {
        background: transparent !important;
        padding: 0 !important;
    }

    /* 可编辑状态下的光标样式 */
    &[contenteditable="true"]:focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
}
</style>
