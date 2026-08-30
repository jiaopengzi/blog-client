<!--
 * FilePath    : blog-client-nuxt\src\components\editor\components\codemirror\index.vue
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
import { notifyVimModeChange, resolveVimModeName, syncVimModeWithIme, type VimModeChangeEvent, type VimModeName } from "../../utils/vim-ime"

import { clearEditorView } from "../../command/constant"
import type { CodeEditorProps } from "./types"

defineOptions({ name: "EditorCodemirror" })

const {
    doc, // 编辑器内容
    cmCommand = undefined, // 编辑器命令
    vimMode = false, // 是否开启 vim 模式
    vimMappings = [], // Vim 快捷键映射
    vimImePort = 8765, // Vim 输入法切换服务端口
    initDocIsEmpty = true, // 初始文档是否为空, 默认为空
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
} = defineProps<CodeEditorProps>()

const codemirrorRef = useTemplateRef<HTMLElement | null>("codemirrorRef") // 编辑器 DOM 节点

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

const onMouseEnter = () => {
    if (!isWatchMouse) return
    emit("is-mouse-in-element", true)
}

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

    codemirrorRef.value.style.setProperty("--jpz-codemirror-width", `${w}`)
    codemirrorRef.value.style.setProperty("--jpz-codemirror-height", `${h}`)
}

// 监听 props 宽高变化
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

// 反馈第 2 轮(编辑器高度塌陷): watch immediate 的 nextTick 回调在 Nuxt 异步页面组件下
// 可能早于本组件挂载执行(codemirrorRef 为 null 直接返回), 且 height/width 之后不变不再触发,
// 导致 --jpz-codemirror-height 从未设置、编辑器塌陷为单行高度(app-option 的 JSON/CSS 编辑器)
// 挂载后兜底设置一次, 保证变量必定写入(SPA 下此调用为幂等重复, 无副作用)
onMounted(() => {
    initializeCssVariable(width, height)
})

// 编辑器实例
let cmView: EditorView | undefined
let currentVimMode: VimModeName = "normal"

type VimCompatibleCm = {
    on: (eventName: "vim-mode-change", listener: (modeObj: VimModeChangeEvent) => void) => void
    off: (eventName: "vim-mode-change", listener: (modeObj: VimModeChangeEvent) => void) => void
    state?: {
        vim?: {
            insertMode?: boolean
            visualMode?: boolean
        }
    }
}

type VimCompatibleEditorView = EditorView & {
    cm?: VimCompatibleCm
}

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
        emit("update-editor-doc", state.doc.toString()) // 更新编辑器内容并提交给父组件
    }
})

/**
 * getVimCompatibleCm 获取 codemirror-vim 挂在到 EditorView 上的兼容实例
 * @returns 兼容的 Vim 编辑器实例, 不存在时返回 null
 */
const getVimCompatibleCm = (): VimCompatibleCm | null => {
    return (cmView as VimCompatibleEditorView | undefined)?.cm ?? null
}

/**
 * resolveCurrentVimModeFromEditor 尝试从 codemirror-vim 当前状态推导实际 Vim 模式
 * 监听器首次挂载时, 三方库通常不会补发一次 mode-change 事件, 因此这里需要主动读取当前状态用于输入法校准
 * @param vimCm - 当前 Vim 兼容实例
 * @returns 当前推导出的 Vim 模式
 */
const resolveCurrentVimModeFromEditor = (vimCm: VimCompatibleCm): VimModeName => {
    if (vimCm.state?.vim?.visualMode) {
        return "visual"
    }

    if (vimCm.state?.vim?.insertMode) {
        return "insert"
    }

    return "normal"
}

/**
 * handleVimModeChange 处理 Vim 模式切换事件, 并同步通知本地输入法服务
 * @param modeObj - codemirror-vim 发出的模式对象
 * @returns 无返回值
 */
const handleVimModeChange = (modeObj: VimModeChangeEvent): void => {
    const nextMode = resolveVimModeName(modeObj)
    const previousMode = currentVimMode
    currentVimMode = nextMode

    if (previousMode === nextMode) {
        return
    }

    void notifyVimModeChange({
        modeBefore: previousMode,
        modeAfter: nextMode,
        port: vimImePort,
    })
}

/**
 * detachVimModeChangeListener 移除当前编辑器上的 Vim 模式切换监听
 * @returns 无返回值
 */
const detachVimModeChangeListener = (): void => {
    getVimCompatibleCm()?.off("vim-mode-change", handleVimModeChange)
}

/**
 * attachVimModeChangeListener 为当前编辑器挂载 Vim 模式切换监听
 * 重复调用时会先移除旧监听, 避免同一实例重复上报
 * @returns 无返回值
 */
const attachVimModeChangeListener = (): void => {
    const vimCm = getVimCompatibleCm()

    if (!vimCm) {
        return
    }

    currentVimMode = resolveCurrentVimModeFromEditor(vimCm)
    vimCm.off("vim-mode-change", handleVimModeChange)
    vimCm.on("vim-mode-change", handleVimModeChange)

    void syncVimModeWithIme(currentVimMode, vimImePort)
}

/**
 * syncVimImeBackToNormal 在 Vim 模式被关闭或编辑器销毁前, 尝试把输入法恢复到 normal 对应的英文态
 * 当前 IME 服务仅依赖 mode-after 决定最终状态, 因此这里即使本地记录已是 normal, 也要再强制校准一次英文态
 * @returns 无返回值
 */
const syncVimImeBackToNormal = (): void => {
    currentVimMode = "normal"

    void syncVimModeWithIme("normal", vimImePort)
}

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

        if (vimMode) {
            attachVimModeChangeListener()
        }
    }
}

// 执行按钮命令
const runCommand = (commandName: CommandsKey, customContent: MarkdownEditorCommandItem = {}): void => {
    if (!cmView) return // 编辑器实例未就绪时跳过

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

const insertContent = (content: string): void => {
    if (!cmView) return // 编辑器实例未就绪时跳过
    editorInsertContent(cmView, content)
}

/**
 * @description: 用新的完整内容替换编辑器文档, 供保存前自动修复结果回写使用
 * @param content 修复后的完整 Markdown 内容
 * @return 无返回值
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
        yMargin = 350 // 当第一行的时候设置为 350, 不会出现滚动到顶部的情况
    }
    if (!cmView) return // 编辑器实例未就绪时跳过
    const line = cmView.state.doc.line(lineNumber) // 获取当前元素在编辑器中的行数

    // 第一步: 只移动光标, 不附带 scrollIntoView effect (CM6 不会自动滚动)
    cmView.dispatch({
        selection: {
            anchor: line.from,
            head: line.from,
        },
    })

    // 编辑器实例未就绪时跳过
    if (!cmView) return

    const { top } = cmView.lineBlockAt(line.from) // 获取当前元素在编辑器中的位置

    // 第二步: 直接设置 scrollDOM.scrollTop, 绕过 CodeMirror 内部的 scrollRectIntoView 逻辑
    // scrollRectIntoView 会遍历整个 DOM 树向上滚动所有可滚动祖先容器(如 el-main), 导致外部页面滚动
    cmView.scrollDOM.scrollTop = Math.max(0, top - yMargin)
}

// 标题跳转
watch(
    () => headingShowCurrentIndex,
    (newIndex) => {
        // 编辑器实例未就绪(如组件挂载/卸载过渡期)时跳过, 避免空引用
        if (!cmView) return

        // 如果没有目录或者索引小于 0 则不执行
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
    // 编辑器实例未就绪(如卸载过渡期触发的滚动事件)时跳过
    if (!cmView) return

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

// 监听 doc 变化, 更新编辑器内容
watch(
    () => doc,
    (newDoc) => {
        // 当 doc 初始值不为空时, 设置编辑器初始内容为 newDoc, 只在第一次加载时执行
        if (!initDocIsEmpty && initCount === 0 && newDoc && cmView) {
            initCount++ // 初始化计数器加 1
            cmView.dispatch({
                changes: {
                    from: 0,
                    to: cmView.state.doc.length,
                    insert: newDoc,
                },
            })
        }

        // 当 doc 为空时, 清空编辑器(实例未就绪时跳过, 避免卸载过渡期空引用)
        if (newDoc === "" && cmView) {
            clearEditorView(cmView) // 清空编辑器
        }
    },
)

// 监听 vimMode 变化, 更改 vim 模式
watch(
    () => vimMode,
    (newVal) => {
        if (!cmView) {
            return
        }

        // 更新 vim 模式
        options.value.vimMode = newVal

        if (!newVal) {
            syncVimImeBackToNormal()
            detachVimModeChangeListener()
        }

        // 重新加载 vim 模式
        cmView.dispatch({
            effects: vimModeCompartment.reconfigure(newVal ? createVimExtension() : []),
        })

        nextTick(() => {
            if (newVal) {
                attachVimModeChangeListener()
            }
        })
    },
)

/**
 * 监听 vimMappings 变化, 重新应用用户映射和默认剪贴板桥接
 */
watch(
    () => vimMappings,
    (newMappings) => {
        if (!cmView) return // 编辑器实例未就绪时跳过(卸载过渡期)
        applyVimMappings(newMappings ?? [])
    },
    {
        deep: true,
    },
)

// 监听 mentions 变化, 更新编辑器内容
watch(
    () => mentions,
    (newVal) => {
        if (!newVal) return // 如果没有 mentions 则不执行
        if (!cmView) return // 编辑器实例未就绪时跳过(卸载过渡期)
        // 更新 mentions
        options.value.mention = newVal
        cmView.dispatch({
            effects: completionCompartment.reconfigure(unifiedCompletion(newVal)),
        })
    },

    { deep: true },
)

// 监听 theme 变化, 更改主题
watch(
    () => theme,
    (newTheme) => {
        if (!newTheme) return // 如果没有主题则不执行
        if (!cmView) return // 编辑器实例未就绪时跳过(卸载过渡期)
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
    detachVimModeChangeListener()
    syncVimImeBackToNormal()
    // 实例未就绪(卸载过渡期/重复卸载)时跳过销毁
    if (cmView) {
        cmView.scrollDOM.removeEventListener("scroll", handleScroll) // 移除监听滚动事件
        cmView.destroy() // 销毁编辑器实例
        cmView = undefined
    }
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
