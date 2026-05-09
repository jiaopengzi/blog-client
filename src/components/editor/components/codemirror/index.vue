<!--
 * FilePath    : blog-client\src\components\editor\components\codemirror\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : codemirror 编辑器组件
-->

<template>
    <div ref="codemirrorRef" id="jpz-codemirror" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></div>
</template>

<script lang="ts" setup>
import "@/assets/scss/codemirror.scss"

import { type Extension } from "@codemirror/state"
import type { ViewUpdate } from "@codemirror/view"
import { computed, type ComputedRef, nextTick, onMounted, onUnmounted, useTemplateRef, watch } from "vue"

import type { MarkdownEditorCommandItem } from "@/components/editor/command"
import { CommandsKey, editorInsertContent, editorInsertFormatContent, markdownEditorCommands } from "@/components/editor/command"
import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

import { completionCompartment, unifiedCompletion } from "@/pkg/codemirror/extension/completion"
import { getTheme, Theme, themeCompartment, ThemeMode } from "@/pkg/codemirror/extension/theme"
import { applyVimMappings, createVimExtension, vimModeCompartment } from "@/pkg/codemirror/extension/vim"
import { type DefaultSetupOptions } from "@/pkg/codemirror/options"
import { createDefaultSetup } from "@/pkg/codemirror/setup"

import { clearEditorView } from "../../command/constant"
import type { CodeEditorProps } from "./types"

defineOptions({ name: "EditorCodemirror" })

const {
    doc, // 编辑器内容
    cmCommand = undefined, // 编辑器命令
    vimMode = false, // 是否开启 vim 模式
    vimMappings = [], // Vim 快捷键映射
    initDocIsEmpty = true, // 初始文档是否为空,默认为空
    height = "100%", // 编辑器高度
    width = "100%", // 编辑器宽度
    mentions = [], // @ 提及补全
    headingShowCurrentIndex = 0, // 当前展示的标题的索引
    tocMarkdown = [], // markdown 目录内容
    isWatchMouse = false, // 是否监听鼠标进入编辑器
    isUserScrollCmEditor = false, // 是否开启用户滚动编辑器
    createSetup = createDefaultSetup, // 编辑器配置项
    placeholderText = "", // 占位符文本
    mdlintUseWorker = true, // 是否使用 web worker 进行 lint 检查
    mdlintRules = {
        rule002: false, // 默认不启用规则 002
        rule003: false, // 默认不启用规则 003
    }, // Markdown 规则配置
    theme = getTheme(Theme.MD, ThemeMode.Dark), // 主题
    imageUploadHandler = void 0, // 图片上传处理器
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
const initializeCssVariable = (w: string | undefined, h: string | undefined) => {
    // 设置默认值
    if (!w) {
        w = "100%"
    }
    if (!h) {
        h = "100%"
    }

    // 如果 w 或 h 为纯数字就加上 px 单位
    const numberReg = /^\d+$/

    if (numberReg.test(w)) {
        w = `${w}px`
    }

    if (numberReg.test(h)) {
        h = `${h}px`
    }

    if (!codemirrorRef.value) return

    // console.log("============>w,h", w, h)
    codemirrorRef.value.style.setProperty("--jpz-codemirror-width", `${w}`)
    codemirrorRef.value.style.setProperty("--jpz-codemirror-height", `${h}`)
}

// 监听 props 宽高 变化
watch(
    () => [height, width],
    ([newHeight, newWidth]) => {
        nextTick(() => {
            initializeCssVariable(newWidth, newHeight)
        })
    },
    {
        immediate: true,
    },
)

// 编辑器实例
let cmView: EditorView

const options: ComputedRef<DefaultSetupOptions> = computed(() => {
    return {
        vimMode: vimMode || false, // 是否开启 vim 模式
        mention: mentions || [], // @ 提及补全
        placeholderText: placeholderText || "", // 占位符文本
        imageUploadHandler,
        mdlintOptions: {
            useWorker: mdlintUseWorker, // 是否使用 web worker 进行 lint 检查
            rules: mdlintRules || { rule002: false, rule003: false }, // Markdown 规则配置
        },
        theme: theme || getTheme(Theme.MD, ThemeMode.Dark), // 主题
    }
})

// 更新编辑器内容
const updateDocInfo: Extension = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
        const { state } = viewUpdate.view
        emit("update-editor-doc", state.doc.toString()) // 更新编辑器内容 提交给父组件
    }
})

// 初始化 CodeMirror
const initCodeMirror = (opts: DefaultSetupOptions) => {
    if (codemirrorRef.value) {
        applyVimMappings(vimMappings)

        // 初始化编辑器
        const state = EditorState.create({
            doc: doc || "",
            extensions: [createSetup(opts), updateDocInfo],
        })

        // 创建编辑器实例
        cmView = new EditorView({
            state,
            parent: codemirrorRef.value,
        })

        cmView.scrollDOM.addEventListener("scroll", handleScroll) // 监听滚动事件
    }
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

/**
 * 用新的完整内容替换编辑器文档, 供保存前自动修复结果回写使用.
 * @param content 修复后的完整 Markdown 内容.
 * @returns void.
 */
const replaceContent = (content: string): void => {
    if (!cmView || cmView.state.doc.toString() === content) {
        return
    }

    cmView.dispatch({
        changes: {
            from: 0,
            to: cmView.state.doc.length,
            insert: content,
        },
    })
}

// 滚动到指定行
const scrollIntoViewLine = (lineNumber: number): void => {
    let yMargin = 5 // 默认值 5
    if (lineNumber === 1) {
        yMargin = 350 // 当第一行的时候设置为 350，不会出现滚动到顶部的情况
    }
    const line = cmView.state.doc.line(lineNumber) // 获取当前元素在编辑器中的行数

    // // 精准跳转选中目标行 但不能是平滑滚动
    // cmView.dispatch({
    //     selection: {
    //         anchor: line.from,
    //         head: line.from,
    //     },
    //     // 通过 effects 会影响到外部 DOM 树的 scroll 事件, 导致外部页面滚动
    //     effects: EditorView.scrollIntoView(
    //         // 滚动到当前行
    //         line.from,
    //         {
    //             y: "start", // "nearest" | "start" | "end" | "center"
    //             yMargin, // 默认值 5
    //         },
    //     ),
    // })

    // 第一步：只移动光标，不附带 scrollIntoView effect（CM6 不会自动滚动）
    cmView.dispatch({
        selection: {
            anchor: line.from,
            head: line.from,
        },
    })

    const { top } = cmView.lineBlockAt(line.from) // 获取当前元素在编辑器中的位置

    // // 滑动到指定行有一些问题 内容较多时会出现滑动不到指定行的情况,因为没有渲染完全
    // cmView.scrollDOM.scrollTo({ top, behavior: "smooth" }) // 滚动到当前行

    // 第二步：直接设置 scrollDOM.scrollTop，绕过 CodeMirror 内部的 scrollRectIntoView 逻辑
    // scrollRectIntoView 会遍历整个 DOM 树向上滚动所有可滚动祖先容器(如 el-main), 导致外部页面滚动
    cmView.scrollDOM.scrollTop = Math.max(0, top - yMargin)
}

// 标题跳转
watch(
    () => headingShowCurrentIndex,
    (newIndex) => {
        // 如果没有目录或者索引小于0则不执行
        if (!tocMarkdown || tocMarkdown.length === 0 || newIndex === void 0 || newIndex < 0 || isUserScrollCmEditor || tocMarkdown.length < newIndex) return

        // 跳转编辑器选中目标行
        scrollIntoViewLine(tocMarkdown[newIndex]!.markdownLineNumber)
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

// 初始化计数器
let initCount = 0

// 监听 doc 变化 更新编辑器内容
watch(
    () => doc,
    (newDoc) => {
        // 当 doc 初始值不为空时, 设置编辑器初始内容为 newDoc, 只在第一次加载时执行
        if (!initDocIsEmpty && initCount === 0 && newDoc && cmView) {
            initCount++ // 初始化计数器加1
            cmView.dispatch({
                changes: {
                    from: 0,
                    to: cmView.state.doc.length,
                    insert: newDoc,
                },
            })
        }

        // 当 doc 为空时, 清空编辑器
        if (newDoc === "") {
            clearEditorView(cmView) // 清空编辑器
        }
    },
)

// 监听 vimMode 变化 更改 vim 模式
watch(
    () => vimMode,
    (newVal) => {
        // 更新 vim 模式
        options.value.vimMode = newVal

        // 重新加载 vim 模式
        cmView.dispatch({
            effects: vimModeCompartment.reconfigure(newVal ? createVimExtension() : []),
        })
    },
)

/**
 * 监听 vimMappings 变化, 重新应用用户映射和默认剪贴板桥接.
 */
watch(
    () => vimMappings,
    (newMappings) => {
        applyVimMappings(newMappings ?? [])
    },
    {
        deep: true,
    },
)

// 监听 mentions 变化 更新编辑器内容
watch(
    () => mentions,
    (newVal) => {
        if (!newVal) return // 如果没有 mentions 则不执行
        // 更新 mentions
        options.value.mention = newVal
        cmView.dispatch({
            effects: completionCompartment.reconfigure(unifiedCompletion(newVal)),
        })
    },

    { deep: true },
)

// 监听 theme 变化 更改主题
watch(
    () => theme,
    (newTheme) => {
        if (!newTheme) return // 如果没有主题则不执行
        cmView.dispatch({
            effects: themeCompartment.reconfigure(newTheme),
        })
    },

    { deep: true },
)

// 执行命令
watch(
    () => cmCommand,
    (newVal, oldVal) => {
        // 如果没有命令或者编辑器实例不存在则不执行
        if (!newVal || !cmView) return

        // 如果没有命令或者时间相同则不执行
        if (!newVal.commandName || (oldVal && newVal.time === oldVal.time)) return

        runCommand(newVal.commandName, newVal.customContent) // 执行命令
    },
    {
        deep: true,
    },
)

// 初始化
onMounted(() => {
    initCodeMirror(options.value) // 初始化 CodeMirror
})

onUnmounted(() => {
    cmView.scrollDOM.removeEventListener("scroll", handleScroll) // 移除监听滚动事件
    cmView.destroy() // 销毁编辑器实例
})

// 导出函数
defineExpose({
    root: codemirrorRef,
    insertContent,
    replaceContent,
})
</script>

<style scoped lang="scss">
#jpz-codemirror {
    background-color: var(--jpz-bg-color);
    color: var(--jpz-text-color-primary);
    font-size: 1.1em;
    width: var(--jpz-codemirror-width);
    height: var(--jpz-codemirror-height);
}
</style>
