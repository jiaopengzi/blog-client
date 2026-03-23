/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\theme\lint.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Lint 主题样式
 */

import { type Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

// 暗色主题下的 Lint 样式调整
export const lintDark: Extension = EditorView.theme(
    {
        // 提示框调整
        ".cm-tooltip": {
            borderRadius: "4px",
        },

        // 诊断信息调整
        ".cm-diagnostic": {
            borderRadius: "4px",
        },

        ".cm-diagnosticText": {
            lineHeight: "1.5",
        },

        ".cm-diagnosticSource": {
            lineHeight: "1.5",
        },
    },
    { dark: true },
)

// 亮色主题下的 Lint 样式调整
export const lintLight: Extension = EditorView.theme(
    {
        // 提示框调整
        ".cm-tooltip": {
            borderRadius: "4px",
        },

        // 诊断信息调整
        ".cm-diagnostic": {
            borderRadius: "4px",
        },

        ".cm-diagnosticText": {
            lineHeight: "1.5",
        },

        ".cm-diagnosticSource": {
            lineHeight: "1.5",
        },
    },
    { dark: false },
)

// 根据主题模式获取对应的 Lint 主题样式
export function getLintTheme(darkMode = false): Extension {
    return darkMode ? lintDark : lintLight
}
