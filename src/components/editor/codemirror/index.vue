<!--
 * @FilePath     : \blog-client\src\components\editor\codemirror\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : codemirror 编辑器
-->

<template>
    <div ref="codemirrorRef" id="my-codemirror"></div>
</template>

<script lang="ts" setup>
import "@/assets/scss/codemirror.scss"

import { type Extension } from "@codemirror/state"
import type { ViewUpdate } from "@codemirror/view"
import { vim } from "@replit/codemirror-vim"
import { onMounted, onUnmounted, type Ref, ref, useTemplateRef, watch, watchEffect } from "vue"

import type { MarkdownEditorCommandItem } from "@/components/editor/command"
import { CommandsKey, editorInsertContent, editorInsertFormatContent, markdownEditorCommands } from "@/components/editor/command"
import { createCustomSetup, type CustomSetupOptions, EditorState, EditorView, vimModeCompartment } from "@/pkg/codemirror/setup"

import type { CodeEditorProps } from "./types"

defineOptions({ name: "EditorCodemirror" })

const props = defineProps<CodeEditorProps>() // 定义 props
const codemirrorRef = useTemplateRef<HTMLElement | null>("codemirrorRef") // 编辑器 dom 节点

// 定义 emits 子组件 传参
const emit = defineEmits<{
    (event: "update-editor-doc", editorDoc: string): void
    (
        event: "handle-scroll",
        scrollHeight: number, // 滚动高度
        clientHeight: number, // 可视区域高度
        scrollTop: number, // 滚动距离
        hideDoc: string, // 隐藏部分的 markdown
        showFirstLineNumber: number, // 显示的第一行行号
    ): void
}>()

const initializeCssVariable = () => {
    // 初始化编辑器宽度和高度
    if (codemirrorRef.value && props.width) {
        codemirrorRef.value.style.setProperty("--my-codemirror-width", `${props.width}`)
    }
    if (codemirrorRef.value && props.height) {
        codemirrorRef.value.style.setProperty("--my-codemirror-height", `${props.height}`)
    }
}

// 监听 props 宽高 变化
watchEffect(() => {
    if (codemirrorRef.value && (props.height || props.width)) {
        initializeCssVariable() // 初始化 css 变量
    }
})

// 编辑器实例
let cmView: EditorView = null! // 编辑器实例 null后的感叹号表示不为空

const options: Ref<CustomSetupOptions> = ref({
    vimMode: props.vimMode || true, // 是否开启 vim 模式
})

// 更新编辑器内容
const updateDocInfo: Extension = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
        const { state } = viewUpdate.view
        const newDoc = state.doc.toString()
        if (newDoc !== props.codemirrorDoc) {
            // console.log('newDoc-子组件', newDoc)
            emit("update-editor-doc", newDoc) // 更新编辑器内容 提交给父组件
        }
    }
})

// 初始化 CodeMirror
const initializeCodeMirror = (options: CustomSetupOptions) => {
    // 初始化编辑器
    const state = EditorState.create({
        doc: props.codemirrorDoc || "",
        extensions: [createCustomSetup(options), updateDocInfo],
    })

    // 创建编辑器实例
    cmView = new EditorView({
        state,
        parent: codemirrorRef.value!,
    })

    cmView.scrollDOM.addEventListener("scroll", handleScroll) // 监听滚动事件
}

// 执行按钮命令
const runCommand = (commandName: CommandsKey, customContent: MarkdownEditorCommandItem = {}): void => {
    if (commandName) {
        if (customContent) {
            // 合并自定义内容
            editorInsertFormatContent(cmView, {
                ...markdownEditorCommands[commandName],
                ...customContent,
            })
            return
        }
        // 执行命令
        editorInsertFormatContent(cmView, markdownEditorCommands[commandName])
    }
}

// 插入内容
const insertContent = (content: string): void => {
    editorInsertContent(cmView, content)
}

// 滚动到指定行
const scrollIntoViewLine = (lineNumber: number): void => {
    const line = cmView.state.doc.line(lineNumber) // 获取当前元素在编辑器中的行数

    // 滑动到指定行有一些问题 内容较多时会出现滑动不到指定行的情况,因为没有渲染完全
    // const { top } = cmView.lineBlockAt(line.from) // 获取当前元素在编辑器中的位置
    // cmView.scrollDOM.scrollTo({ top, behavior: "smooth" }) // 滚动到当前行

    // 精准跳转选中目标行 但不能是平滑滚动
    cmView.dispatch({
        selection: {
            anchor: line.from,
            head: line.from,
        },
        effects: EditorView.scrollIntoView(
            // 滚动到当前行
            line.from,
            {
                y: "nearest", // "nearest" | "start" | "end" | "center"
                yMargin: 350, // 默认值 5
            },
        ),
    })
}

/**
 * @description: 处理编辑器滚动事件
 */
const handleScroll = () => {
    const hideTopBlockInfo = cmView.lineBlockAtHeight(cmView.scrollDOM.scrollTop) // 获取不可见部分的 block 信息
    const hideTopMarkdown = cmView.state.sliceDoc(0, hideTopBlockInfo.from) // 不可见部分的 markdown
    emit(
        "handle-scroll",
        cmView.scrollDOM.scrollHeight,
        cmView.scrollDOM.clientHeight,
        cmView.scrollDOM.scrollTop,
        hideTopMarkdown,
        cmView.state.doc.lineAt(hideTopBlockInfo.from).number,
    )
}

// 监听 props.codemirrorDoc 变化 更新编辑器内容 只有第一次加载的时候才更新
const watchStop = watchEffect(() => {
    if (props.codemirrorDoc && cmView) {
        cmView.dispatch({
            changes: {
                from: 0,
                to: cmView.state.doc.length,
                insert: props.codemirrorDoc,
            },
        })
        watchStop() // 只执行一次
    }
})

watch(
    () => props.vimMode,
    (newVal) => {
        // 更新 vim 模式
        options.value.vimMode = newVal

        // 重新配置 vim 模式
        cmView.dispatch({
            effects: vimModeCompartment.reconfigure(newVal ? vim({ status: true }) : []),
        })
    },
)

// 初始化
onMounted(() => {
    initializeCssVariable() // 初始化 css 变量
    initializeCodeMirror(options.value) // 初始化 CodeMirror
})

onUnmounted(() => {
    cmView.scrollDOM.removeEventListener("scroll", handleScroll) // 移除监听滚动事件
    cmView.destroy() // 销毁编辑器实例
})

// 导出函数
defineExpose({
    root: codemirrorRef,
    runCommand,
    insertContent,
    scrollIntoViewLine,
})
</script>

<style scoped lang="scss">
#my-codemirror {
    background-color: var(--jpz-bg-color);
    color: var(--jpz-text-color-primary);
    font-size: 1.1em;
}
</style>
