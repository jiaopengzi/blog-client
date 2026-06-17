/*
 * FilePath    : blog-client\src\pkg\codemirror\extension\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : codemirror extension 类型定义
 */

import type { VimKeyMappingContext } from "@/stores/editor-defaults"

/**
 * VimClipboardBridgeAction 定义项目侧会注册到 Vim 的剪贴板 bridge action 名称.
 * 这些 action 只负责回放原生 `"+p` / `"+P`, 以保留三方库自己的 paste 语义.
 */
export type VimClipboardBridgeAction = "clipboardPasteAfter" | "clipboardPasteBefore"

/**
 * VimClipboardBridgeActionArgs 描述 bridge action 透传给 Vim 的运行参数.
 * 当前保留为可选扩展点, 便于后续 bridge 补充额外上下文.
 */
export type VimClipboardBridgeActionArgs = VimActionArgs & {
    after?: boolean
    isEdit?: boolean
}

/**
 * VimClipboardMappingKind 表示用户映射在项目内被识别出的特殊剪贴板语义.
 * 该类型用于把 `"+yy`, `"+p` 等配置翻译为 bridge action.
 */
export type VimClipboardMappingKind = "clipboard-line-yank" | "clipboard-paste-after" | "clipboard-paste-before" | "clipboard-selection-yank"

/**
 * VimMappingContext 表示项目兼容的 Vim keymap 上下文.
 * 当前直接复用 editor-defaults 中定义的上下文联合类型.
 */
export type VimMappingContext = VimKeyMappingContext

/**
 * VimClipboardBridgeDefinition 描述一条需要注册到 Vim 的剪贴板桥接配置.
 * lhs 和 context 决定触发位置, action 指向项目侧 bridge 实现.
 */
export type VimClipboardBridgeDefinition = {
    lhs: string
    context: "normal" | "visual"
    action: VimClipboardBridgeAction
    actionArgs?: VimClipboardBridgeActionArgs
    conflictLhs?: string
}

/**
 * VimRegister 表示 codemirror-vim 的单个寄存器实例.
 * 当前项目只依赖文本与 linewise/blockwise 元数据读写.
 */
export type VimRegister = {
    linewise: boolean
    blockwise: boolean
    setText: (text?: string, linewise?: boolean, blockwise?: boolean) => void
    toString: () => string
}

/**
 * VimCursorPosition 表示 codemirror-vim 内部使用的光标位置.
 * line 为行号, ch 为列号.
 */
export type VimCursorPosition = {
    line: number
    ch: number
}

/**
 * VimActionArgs 表示 Vim action 或 operator 执行时携带的运行参数.
 * repeat, linewise 和 registerName 对应当前命令的重复次数, 行级语义和寄存器名称.
 */
export type VimActionArgs = {
    repeat?: number
    linewise?: boolean
    registerName?: string | null
}

/**
 * VimSelectionRange 表示一段 Vim 选区范围.
 * anchor 与 head 的先后顺序不固定, 调用方需要自行比较.
 */
export type VimSelectionRange = {
    anchor: VimCursorPosition
    head: VimCursorPosition
}

/**
 * VimRegisterController 表示 codemirror-vim 暴露给运行时的寄存器控制器.
 * 当前项目依赖 pushText 与 getRegister, 用于复用三方库既有寄存器逻辑并补齐系统剪贴板镜像.
 */
export type VimRegisterController = {
    pushText: (registerName: string | undefined, operator: string, text: string, linewise?: boolean, blockwise?: boolean) => void
    getRegister: (registerName?: string) => VimRegister
}

/**
 * VimCm 表示当前文件实际依赖的最小 Vim 编辑器能力集合.
 * 这里只声明 bridge 逻辑真正会访问的状态和方法, 避免把完整三方类型耦合进来.
 */
export type VimCm = {
    state: {
        vim?: {
            visualMode?: boolean
            visualBlock?: boolean
            sel?: {
                anchor: VimCursorPosition
                head: VimCursorPosition
            }
        }
    }
    getCursor: () => VimCursorPosition
    getLine: (line: number) => string
    lastLine: () => number
    replaceRange: (text: string, from: VimCursorPosition) => void
    setCursor: (line: number, ch: number) => void
    getSelection: () => string
}
