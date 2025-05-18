<!--
 * FilePath    : blog-client\src\views\test\index.vue
 * Description : 测试页面
-->
<template>
    <div ref="codemirrorRef" id="my-codemirror"></div>
</template>

<script lang="ts" setup>
import "@/assets/scss/codemirror.scss"

import type { Completion, CompletionResult } from "@codemirror/autocomplete"
import { autocompletion } from "@codemirror/autocomplete"
import { CompletionContext } from "@codemirror/autocomplete"
import { EditorState, type Extension } from "@codemirror/state"
import { EditorView, type ViewUpdate } from "@codemirror/view"
import { onMounted, useTemplateRef } from "vue"

defineOptions({ name: "EditorCodemirror" })

// 定义 emits 子组件 传参
const emit = defineEmits<{
    (event: "update-editor-doc", editorDoc: string): void
}>()

const codemirrorRef = useTemplateRef<HTMLElement | null>("codemirrorRef") // 编辑器 dom 节点

// 编辑器实例
let cmView: EditorView = null! // 编辑器实例 null后的感叹号表示不为空

// 更新编辑器内容
const updateDocInfo: Extension = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
        const { state } = viewUpdate.view
        const newDoc = state.doc.toString()
        if (newDoc) {
            emit("update-editor-doc", newDoc) // 触发更新编辑器内容事件
        }
    }
})

// 初始化 CodeMirror
const initializeCodeMirror = () => {
    // 初始化编辑器
    const state = EditorState.create({
        doc: "",
        extensions: [createCustomSetup(), updateDocInfo],
    })

    // 创建编辑器实例
    cmView = new EditorView({
        state,
        parent: codemirrorRef.value!,
    })

    cmView.scrollDOM.addEventListener("scroll", () => {}) // 监听滚动事件
}

function mentionOverride(data: Completion[] = []): (context: CompletionContext) => CompletionResult | null {
    return (context: CompletionContext): CompletionResult | null => {
        const keyword = context.matchBefore(/@([\u4e00-\u9fa5\w]+)?/) // 匹配以@开头后的任意字符，包括中文、英文、数字等
        if (!keyword) return null // 如果没有匹配到则不补全
        if (keyword.from === keyword.to && !context.explicit) return null // 如果没有输入内容则不补全

        return {
            from: keyword.from,
            options: data,
        }
    }
}

const mentions = [
    { label: "@jiaopengzi", apply: "[@jiaopengzi](id123)" },
    { label: "@焦棚子", apply: "[@焦棚子](id122)" },
]

const createCustomSetup = () => {
    const baseExtension: Extension[] = [
        autocompletion({ override: [mentionOverride(mentions)] }), // 自动补全
    ]
    return baseExtension
}

// 初始化
onMounted(() => {
    initializeCodeMirror() // 初始化 CodeMirror
})
</script>

<style scoped lang="scss">
#my-codemirror {
    width: 400px;
    height: 200px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
