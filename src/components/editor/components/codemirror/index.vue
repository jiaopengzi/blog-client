<!--
 * FilePath    : blog-client\src\components\editor\components\codemirror\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : codemirror 编辑器组件
-->

<template>
    <div ref="codemirrorRef" id="my-codemirror" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></div>
</template>

<script lang="ts" setup>
import "@/assets/scss/codemirror.scss"

import { type Extension } from "@codemirror/state"
import type { ViewUpdate } from "@codemirror/view"
import { vim } from "@replit/codemirror-vim"
import { onMounted, onUnmounted, type Ref, ref, useTemplateRef, watch } from "vue"

import type { MarkdownEditorCommandItem } from "@/components/editor/command"
import { CommandsKey, editorInsertContent, editorInsertFormatContent, markdownEditorCommands } from "@/components/editor/command"
import { createCustomSetup, type CustomSetupOptions, EditorState, EditorView, vimModeCompartment } from "@/pkg/codemirror/setup"

import type { CodeEditorProps } from "./types"

defineOptions({ name: "EditorCodemirror" })

const {
    doc, // 编辑器内容
    height, // 编辑器高度
    width, // 编辑器宽度
    vimMode, // 是否开启 vim 模式

    mentions, // @ 提及补全
    headingShowCurrentIndex, // 当前展示的标题的索引
    tocMarkdown, // markdown 目录内容
    isWatchMouse, // 是否监听鼠标进入编辑器
    cmCommand, // 编辑器命令
    isUserScrollCmEditor, // 是否开启用户滚动编辑器
} = defineProps<CodeEditorProps>() // 定义 props
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
    (event: "is-mouse-in-element", isMouseInElement: boolean): void
    (event: "update-is-user-scroll", val: boolean): void // 更新是否用户手动滚动预览
}>()

// 鼠标进入
const onMouseEnter = () => {
    if (!isWatchMouse) return
    emit("is-mouse-in-element", true)
}

// 鼠标离开
const onMouseLeave = () => {
    if (!isWatchMouse) return
    emit("is-mouse-in-element", false)
}

// 初始化编辑器宽度和高度
const initializeCssVariable = () => {
    if (codemirrorRef.value && width) {
        codemirrorRef.value.style.setProperty("--my-codemirror-width", `${width}`)
    }
    if (codemirrorRef.value && height) {
        codemirrorRef.value.style.setProperty("--my-codemirror-height", `${height}`)
    }
}

// 监听 props 宽高 变化
watch(
    () => [height, width],
    () => {
        if (codemirrorRef.value && (height || width)) {
            initializeCssVariable() // 初始化 css 变量
        }
    },
)

// 编辑器实例
let cmView: EditorView = null! // 编辑器实例 null后的感叹号表示不为空

const options: Ref<CustomSetupOptions> = ref({
    vimMode: vimMode || false, // 是否开启 vim 模式
    mentions: mentions || [], // @ 提及补全
})

// 更新编辑器内容
const updateDocInfo: Extension = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
        const { state } = viewUpdate.view
        const newDoc = state.doc.toString()
        if (newDoc !== doc) {
            emit("update-editor-doc", newDoc) // 更新编辑器内容 提交给父组件
        }
    }
})

// 初始化 CodeMirror
const initializeCodeMirror = (options: CustomSetupOptions) => {
    // 初始化编辑器
    const state = EditorState.create({
        doc: doc || "",
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
    let yMargin = 5 // 默认值 5
    if (lineNumber === 1) {
        yMargin = 350 // 当第一行的时候设置为 350，不会出现滚动到顶部的情况
    }
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
                y: "start", // "nearest" | "start" | "end" | "center"
                yMargin, // 默认值 5
            },
        ),
    })
}

// 标题跳转
watch(
    () => headingShowCurrentIndex,
    (newIndex) => {
        // 如果没有目录或者索引小于0则不执行
        if (!tocMarkdown || newIndex === void 0 || newIndex < 0 || isUserScrollCmEditor) return

        // 跳转编辑器选中目标行
        scrollIntoViewLine(tocMarkdown[newIndex].markdownLineNumber)
        emit("update-is-user-scroll", true)
    },
)

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
const stopWatch = watch(
    () => doc,
    (newDoc) => {
        if (newDoc && cmView) {
            cmView.dispatch({
                changes: {
                    from: 0,
                    to: cmView.state.doc.length,
                    insert: newDoc,
                },
            })
            stopWatch() // 只执行一次
        }
    },
    { immediate: true },
)

watch(
    () => vimMode,
    (newVal) => {
        // 更新 vim 模式
        options.value.vimMode = newVal

        // 重新配置 vim 模式
        cmView.dispatch({
            effects: vimModeCompartment.reconfigure(newVal ? vim({ status: true }) : []),
        })
    },
)

watch(
    () => mentions,
    (newVal) => {
        // 更新 mentions
        options.value.mention = newVal
        initializeCodeMirror(options.value) // 重新初始化编辑器
    },
    { immediate: true, deep: true },
)

// 执行命令
watch(
    () => cmCommand,
    (newVal, oldVal) => {
        if (!newVal.commandName || newVal.time === oldVal.time) return // 如果没有命令或者时间相同则不执行
        runCommand(newVal.commandName, newVal.customContent) // 执行命令
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
    insertContent,
})
</script>

<style scoped lang="scss">
#my-codemirror {
    background-color: var(--jpz-bg-color);
    color: var(--jpz-text-color-primary);
    font-size: 1.1em;
}
</style>
