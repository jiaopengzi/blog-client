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
import { markdown } from "@codemirror/lang-markdown"
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from "@codemirror/language"
import { lintKeymap } from "@codemirror/lint"
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search"
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
import { handleDropImage, handlePasteImage } from "./extension/imgUpload"
import { vim, vimModeCompartment } from "./extension/vim"
import { defaultOptions, type DefaultSetupOptions } from "./options"

// 基础 extension 集合
const baseExtension = (): Extension[] => {
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

// 创建 codemirror setup 类型
export type CreateSetupType = (options?: DefaultSetupOptions) => Extension[]

// 默认的 codemirror setup 工厂函数 markdown 语法
export const createDefaultSetup = (options: DefaultSetupOptions = defaultOptions) => {
    const extension: Extension[] = [
        ...baseExtension(), // 基础 extension

        // 参考 https://github.com/replit/codemirror-vim/issues/227
        vimModeCompartment.of(options.vimMode ? vim({ status: true }) : []), // vim 模式
        completionCompartment.of(unifiedCompletion(options.mention)), // 补全
        placeholder("请开始创作..."), // 占位符文本
        markdown(), // markdown 语法
        bottomPanelExt, // 底部面板
        customKeymap, // 自定义快捷键
        handlePasteImage, // 自定义键盘事件
        handleDropImage, // 自定义拖拽事件
    ]

    return extension
}

// css 语法 setup 工厂函数
export const createCssSetup = () => {
    const extension: Extension[] = [
        ...baseExtension(), // 基础 extension
        css(), // css 语法
        placeholder("请输入自定义的 CSS..."), // 占位符文本
    ]

    return extension
}
