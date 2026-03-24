/**
 * FilePath    : blog-client-dev/src/pkg/codemirror/extension/theme/vue/light.ts
 * Description : vue light 主题
 */

import { tags as t } from "@lezer/highlight"
import { createTheme, type CreateThemeOptions } from "@uiw/codemirror-themes"
import { vueLightPreset } from "@/theme/presets/definitions/vue-light"

const p = vueLightPreset.palette

export const vueLightSettings: CreateThemeOptions["settings"] = {
    background: p.bgPage,
    foreground: p.textPrimary,
    caret: p.primary,
    selection: p.bgOverlay,
    selectionMatch: p.borderHover,
    lineHighlight: "transparent",
    gutterBackground: p.bgPage,
    gutterForeground: p.textSecondary,
    gutterActiveForeground: p.textPrimary,
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
}

export const vueLightStyles: CreateThemeOptions["styles"] = [
    { tag: t.heading, fontWeight: "700", color: p.primary },
    { tag: [t.heading1, t.heading2, t.heading3, t.heading4], fontWeight: "700", color: p.primary },
    { tag: t.strong, fontWeight: "700", color: p.textPrimary },
    { tag: t.emphasis, fontStyle: "italic", color: p.textPrimary },
    { tag: t.link, color: p.primary, textDecoration: "underline" },
    { tag: t.url, color: p.primary },
    { tag: t.list, color: p.textSecondary },
    { tag: t.contentSeparator, color: p.border },
    { tag: t.monospace, color: p.textSecondary, padding: "2px 6px", borderRadius: "6px" },
    { tag: t.string, color: p.success },
    { tag: t.separator, color: p.border, borderBottom: `1px solid ${p.border}` },

    { tag: [t.keyword, t.operatorKeyword, t.modifier], color: p.danger },
    { tag: [t.controlKeyword, t.moduleKeyword], color: p.secondary },
    { tag: [t.name, t.deleted, t.character, t.macroName, t.propertyName, t.variableName, t.labelName, t.definition(t.name)], color: p.textPrimary },
    { tag: [t.typeName, t.className, t.tagName, t.number, t.changed, t.annotation, t.self, t.namespace], color: p.success },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: p.primary },
    { tag: [t.number, t.bool], color: p.warning },
    { tag: [t.operator, t.punctuation, t.separator, t.escape], color: p.textSecondary },
    { tag: [t.regexp], color: p.danger },
    { tag: [t.special(t.string), t.processingInstruction, t.inserted], color: p.primary },
    { tag: [t.angleBracket], color: p.textSecondary },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: [t.meta, t.comment], color: p.info },
    { tag: t.invalid, color: p.error },
]

export function vueLightInit(options?: Partial<CreateThemeOptions>) {
    const { theme = "light", settings = {}, styles = [] } = options || {}
    return createTheme({
        theme: theme,
        settings: {
            ...vueLightSettings,
            ...settings,
        },
        styles: [...vueLightStyles, ...styles],
    })
}

export const vueLight = vueLightInit()
