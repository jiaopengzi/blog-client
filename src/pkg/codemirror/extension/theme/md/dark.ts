/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\theme\md\dark.ts
 * Description : markdown 暗黑主题
 */

import { tags as t } from "@lezer/highlight"
import { createTheme, type CreateThemeOptions } from "@uiw/codemirror-themes"

export const markdownDarkSettings: CreateThemeOptions["settings"] = {
    background: "#0d1117",
    foreground: "#c9d1d9",
    caret: "#c9d1d9",
    selection: "#06357a33",
    selectionMatch: "#0b5cff55",
    lineHighlight: "#161b22",
    gutterBackground: "#0d1117",
    gutterForeground: "#8b949e",
    gutterActiveForeground: "#c9d1d9",
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
}

export const markdownDarkStyles: CreateThemeOptions["styles"] = [
    // 标题 (H1-H6) - GitHub Dark 风格蓝色强调
    { tag: t.heading, fontWeight: "700", color: "#79c0ff" },
    { tag: t.heading1, fontWeight: "700", color: "#79c0ff", fontSize: "1.2em" },
    { tag: t.heading2, fontWeight: "700", color: "#79c0ff", fontSize: "1.1em" },
    { tag: t.heading3, fontWeight: "700", color: "#79c0ff", fontSize: "1em" },

    // 粗体/斜体 - 保持可读性而不是鲜艳的强调色
    { tag: t.strong, fontWeight: "700", color: "#c9d1d9" },
    { tag: t.emphasis, fontStyle: "italic", color: "#c9d1d9" },

    // 链接（柔和一些）
    { tag: t.link, color: "#79c0ff", textDecoration: "underline" },
    { tag: t.url, color: "#79c0ff" },

    // 列表标记
    { tag: t.list, color: "#6e7681" },
    { tag: t.contentSeparator, color: "#30363d" },

    // 代码块/内联代码 - 更柔和的背景和圆角
    { tag: t.monospace, color: "#6e7681", padding: "2px 6px", borderRadius: "6px" },
    { tag: t.string, color: "#9ecbff" },

    // 分割线
    { tag: t.separator, color: "#30363d", borderBottom: "1px solid #30363d" },

    // 其他基础样式
    {
        tag: [
            t.keyword,
            t.operatorKeyword,
            t.modifier,
            t.color,
            t.constant(t.name),
            t.standard(t.name),
            t.standard(t.tagName),
            t.special(t.brace),
            t.atom,
            t.bool,
            t.special(t.variableName),
        ],
        color: "#ff7b72",
    },
    { tag: [t.controlKeyword, t.moduleKeyword], color: "#d2a8ff" },
    {
        tag: [t.name, t.deleted, t.character, t.macroName, t.propertyName, t.variableName, t.labelName, t.definition(t.name)],
        color: "#c9d1d9",
    },
    {
        tag: [t.typeName, t.className, t.tagName, t.number, t.changed, t.annotation, t.self, t.namespace],
        color: "#7ee787",
    },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#79c0ff" },
    { tag: [t.number], color: "#b5cea8" },
    { tag: [t.operator, t.punctuation, t.separator, t.escape], color: "#8b949e" },
    { tag: [t.regexp], color: "#ff7b72" },
    { tag: [t.special(t.string), t.processingInstruction, t.inserted], color: "#79c0ff" },
    { tag: [t.angleBracket], color: "#8b949e" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: [t.meta, t.comment], color: "#6e7781" },
    { tag: t.invalid, color: "#f85149" },
]

export function markdownDarkInit(options?: Partial<CreateThemeOptions>) {
    const { theme = "dark", settings = {}, styles = [] } = options || {}
    return createTheme({
        theme: theme,
        settings: {
            ...markdownDarkSettings,
            ...settings,
        },
        styles: [...markdownDarkStyles, ...styles],
    })
}

export const mdDark = markdownDarkInit()
