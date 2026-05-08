/**
 * @FilePath     : \blog-client\src\pkg\codemirror\setup.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 重新封装 codemirror 参考: codemirror 包源码 https://www.npmjs.com/package/codemirror
 */

import { closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { css } from "@codemirror/lang-css"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from "@codemirror/language"
import { lintKeymap } from "@codemirror/lint"
import { highlightSelectionMatches, search, searchKeymap } from "@codemirror/search"
import { EditorState, type Extension } from "@codemirror/state"
import {
    crosshairCursor,
    drawSelection,
    dropCursor,
    EditorView,
    gutter,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    placeholder,
    rectangularSelection,
} from "@codemirror/view"

import { bottomPanelExt } from "./extension/bottomPanel"
import { completionCompartment, unifiedCompletion } from "./extension/completion"
import { customKeymap } from "./extension/hotkey"
import { createImageUploadExtensions } from "./extension/imgUpload"
import { createAutoFixExtension, createMarkdownLinter } from "./extension/mdlint"
import { getTheme, Theme, themeCompartment, ThemeMode } from "./extension/theme"
import { vim, vimModeCompartment } from "./extension/vim"
import { defaultOptions, type DefaultSetupOptions } from "./options"

const sharedMarkdownLanguage = markdown()
const sharedCssLanguage = css()
const sharedJsonLanguage = json()

/**
 * createBaseExtensions 创建可被多个编辑器实例复用的基础扩展集合.
 * @returns 基础扩展数组.
 */
const createBaseExtensions = (): Extension[] => {
    return [
        EditorView.lineWrapping, // 自动换行
        lineNumbers(), // 行号
        highlightActiveLineGutter(), // 高亮当前行 gutter
        highlightSpecialChars(), // 高亮特殊字符
        history(), // 历史记录
        foldGutter(), // 折叠
        drawSelection(), // 选择
        dropCursor(), // 光标
        EditorState.allowMultipleSelections.of(true), // 多选
        indentOnInput(), // 缩进
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }), // 语法高亮
        bracketMatching(), // 匹配
        closeBrackets(), // 关闭括号
        rectangularSelection(), // 矩形选择
        crosshairCursor(), // 十字光标
        highlightActiveLine(), // 高亮当前行
        highlightSelectionMatches(), // 高亮选择匹配
        search({ top: true }), // 搜索面板置顶，避免与底部面板冲突
        keymap.of([
            ...closeBracketsKeymap, // 关闭括号
            ...defaultKeymap, // 默认快捷键
            ...searchKeymap, // 搜索
            ...historyKeymap, // 历史记录
            indentWithTab, // tab 缩进
            ...foldKeymap, // 折叠
            ...completionKeymap, // 自动完成
            ...lintKeymap, // 代码检查
        ]),
        gutter({ class: "gutter-custom" }), // 为 gutter 添加 class
    ]
}

const sharedBaseExtensions = createBaseExtensions()

/**
 * createPlaceholderExtensions 在存在占位文本时才挂载 placeholder 扩展.
 * @param placeholderText 占位文本.
 * @returns placeholder 扩展数组.
 */
const createPlaceholderExtensions = (placeholderText?: string): Extension[] => {
    if (!placeholderText) {
        return []
    }

    return [placeholder(placeholderText)]
}

/**
 * createMarkdownLintExtensions 在启用 lint 配置时挂载 Markdown lint 与自动修复扩展.
 * @param opts 编辑器配置项.
 * @returns Markdown lint 相关扩展数组.
 */
const createMarkdownLintExtensions = (opts: DefaultSetupOptions): Extension[] => {
    if (opts.mdlintOptions === false) {
        return []
    }

    return [createMarkdownLinter(opts.mdlintOptions), createAutoFixExtension({ rules: opts.mdlintOptions?.rules, onSave: opts.onSave })]
}

// 创建 codemirror setup 类型
export type CreateSetupType = (options?: DefaultSetupOptions) => Extension[]

/**
 * createDefaultSetup 创建 Markdown 编辑器的默认扩展集合.
 * @param opts 编辑器配置项.
 * @returns Markdown 编辑器扩展数组.
 */
export const createDefaultSetup = (opts: DefaultSetupOptions = defaultOptions()) => {
    const { handlePasteImage, handleDropImage } = createImageUploadExtensions(opts.imageUploadHandler)
    const enableMentionCompletion = Boolean(opts.mention?.length)

    const extension: Extension[] = [
        ...sharedBaseExtensions, // 基础 extension
        // 参考 https://github.com/replit/codemirror-vim/issues/227
        vimModeCompartment.of(opts.vimMode ? vim({ status: true }) : []), // vim 模式
        completionCompartment.of(unifiedCompletion(opts.mention, { enableMention: enableMentionCompletion, enableEmoji: true })), // 补全
        ...createPlaceholderExtensions(opts.placeholderText), // 占位符文本
        sharedMarkdownLanguage, // markdown 语法
        ...createMarkdownLintExtensions(opts), // markdown 代码检查与自动修复
        bottomPanelExt, // 底部面板
        customKeymap, // 自定义快捷键
        handlePasteImage, // 自定义键盘事件
        handleDropImage, // 自定义拖拽事件
        themeCompartment.of(opts.theme || getTheme(Theme.MD, ThemeMode.Light)), // 主题
    ]

    return extension
}

/**
 * createCssSetup 创建 CSS 编辑器扩展集合.
 * @returns CSS 编辑器扩展数组.
 */
export const createCssSetup = () => {
    const extension: Extension[] = [
        ...sharedBaseExtensions, // 基础 extension
        sharedCssLanguage, // css 语法
        ...createPlaceholderExtensions("请输入自定义的 CSS..."), // 占位符文本
    ]

    return extension
}

/**
 * createJsonSetup 创建 JSON 编辑器扩展集合.
 * @returns JSON 编辑器扩展数组.
 */
export const createJsonSetup = () => {
    const extension: Extension[] = [
        ...sharedBaseExtensions, // 基础 extension
        sharedJsonLanguage, // json 语法
        ...createPlaceholderExtensions("请输入自定义的 JSON..."), // 占位符文本
    ]

    return extension
}
