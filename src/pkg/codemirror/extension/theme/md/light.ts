/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\theme\md\light.ts
 * Description : markdown 明亮主题
 */

import { tags as t } from "@lezer/highlight"
import { createTheme, type CreateThemeOptions } from "@uiw/codemirror-themes"

export const markdownLightSettings: CreateThemeOptions["settings"] = {
    background: "#ffffff",
    foreground: "#24292e",
    caret: "#24292e",
    selection: "#cfe8ff",
    selectionMatch: "#b6ddff",
    gutterBackground: "#ffffff",
    gutterForeground: "#6a737d",
    gutterActiveForeground: "#24292e",
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
}

export const markdownLightStyles: CreateThemeOptions["styles"] = [
    // 标题 (H1-H6) - 使用 GitHub 风格的蓝色强调
    { tag: t.heading, fontWeight: "700", color: "#1f6feb" },
    { tag: t.heading1, fontWeight: "700", color: "#1f6feb", fontSize: "1.2em" },
    { tag: t.heading2, fontWeight: "700", color: "#1f6feb", fontSize: "1.1em" },
    { tag: t.heading3, fontWeight: "700", color: "#1f6feb", fontSize: "1em" },

    // 粗体/斜体 - 保持可读性而不是鲜艳的强调色
    { tag: t.strong, fontWeight: "700", color: "#24292e" },
    { tag: t.emphasis, fontStyle: "italic", color: "#24292e" },

    // 链接 - 柔和一些的蓝色
    { tag: t.link, color: "#1f6feb", textDecoration: "underline" },
    { tag: t.url, color: "#1f6feb" },

    // 列表标记
    { tag: t.list, color: "#6e7681" },
    { tag: t.contentSeparator, color: "#bdbfc4" },

    // 代码块/内联代码
    { tag: t.monospace, color: "#6e7681", padding: "2px 6px", borderRadius: "6px" },
    { tag: t.string, color: "#032f62" },

    // 分割线
    { tag: t.separator, color: "#e1e4e8", borderBottom: "1px solid #e1e4e8" },

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
        color: "#cf222e",
    },
    { tag: [t.moduleKeyword, t.controlKeyword], color: "#8250df" },
    {
        tag: [t.name, t.deleted, t.character, t.macroName, t.propertyName, t.variableName, t.labelName, t.definition(t.name)],
        color: "#24292e",
    },
    {
        tag: [t.typeName, t.className, t.tagName, t.number, t.changed, t.annotation, t.self, t.namespace],
        color: "#005cc5",
    },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#1f6feb" },
    { tag: [t.number], color: "#005cc5" },
    { tag: [t.operator, t.punctuation, t.separator, t.escape], color: "#24292e" },
    { tag: [t.regexp], color: "#d73a49" },
    { tag: [t.special(t.string), t.processingInstruction, t.inserted], color: "#1f6feb" },
    { tag: [t.angleBracket], color: "#24292e" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: [t.meta, t.comment], color: "#6e7781" },
    { tag: t.invalid, color: "#b31d28" },
]

export function markdownLightInit(options?: Partial<CreateThemeOptions>) {
    const { theme = "light", settings = {}, styles = [] } = options || {}
    return createTheme({
        theme: theme,
        settings: {
            ...markdownLightSettings,
            ...settings,
        },
        styles: [...markdownLightStyles, ...styles],
    })
}

export const mdLight = markdownLightInit()
