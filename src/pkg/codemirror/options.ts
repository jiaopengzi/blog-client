/*
 * FilePath    : blog-client\src\pkg\codemirror\options.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器选项
 */

import { type Completion } from "@codemirror/autocomplete"
import { type Extension } from "@codemirror/state"
import type { EditorView } from "@codemirror/view"

import type { MarkdownRulesConfig } from "./extension/mdlint/types"
import { getTheme, Theme, ThemeMode } from "./extension/theme"

export type ImageUploadHandler = ((file: File) => Promise<string | undefined>) | null

// createDefaultSetup 定义options 类型
export type DefaultSetupOptions = {
    vimMode?: boolean // 是否开启 vim 模式
    theme?: Extension // 主题名称
    mention?: Completion[] // @提及补全
    placeholderText?: string // 占位符文本
    onSave?: (view: EditorView) => void // 保存回调, Mod-s 自动修复后触发
    imageUploadHandler?: ImageUploadHandler // 图片上传处理器, null 表示禁用粘贴/拖拽上传
    mdlintOptions?: {
        useWorker?: boolean // 是否使用 web worker 进行 lint 检查
        rules?: MarkdownRulesConfig // Markdown 规则配置
    }
}

// 默认选项
export const defaultOptions = (): DefaultSetupOptions => {
    return {
        vimMode: false, // 默认不开启 vim 模式
        theme: getTheme(Theme.MD, ThemeMode.Light), // 默认主题 vscode light
        mention: [], // 默认不开启 @ 提及补全
        placeholderText: "请开始创作...", // 默认占位符文本
        imageUploadHandler: void 0, // 默认使用编辑器内置上传实现
        mdlintOptions: {
            useWorker: true, // 默认开启 web worker 进行 lint 检查
            rules: {
                rule002: false, // 默认不启用规则 002
                rule003: false, // 默认不启用规则 003
            },
        },
    }
}
