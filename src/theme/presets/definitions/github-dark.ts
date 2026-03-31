/**
 * FilePath    : blog-client\src\theme\presets\definitions\github-dark.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : GitHub 风格的暗色主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const githubDarkPreset: ThemePreset = {
    id: "github-dark",
    label: "GitHub Dark",
    description: "GitHub 风格的暗色主题",
    scheme: "dark",
    palette: {
        primary: "#4493f8",
        secondary: "#4a3c6b",
        success: "#3fb950",
        warning: "#d29922",
        danger: "#f85149",
        error: "#f85149",
        info: "#8b949e",
        footnoteSup: "#2f81f7",
        codeBg: "#1f2937",
        codeText: "#ffa657",
        blockquoteBorder: "#f85149",
        alertImportant: "#ab7df8",
        bg: "#0d1117",
        bgPage: "#010409",
        bgFooter: "#0d1117",
        bgOverlay: "#161b22",
        border: "#30363d",
        borderHover: "#8b949e",
        borderLighter: "#21262d",
        shadowLighter: "0 1px 3px rgba(1, 4, 9, 0.8)",
        shadowLight: "0 3px 6px rgba(1, 4, 9, 0.8)",
        shadow: "0 8px 24px rgba(1, 4, 9, 0.8)",
        fillLighter: "#161b22",
        textPrimary: "#c9d1d9",
        textRegular: "#8b949e",
        textSecondary: "#8b949e",
        textPlaceholder: "#484f58",
        textDisabled: "#484f58",
        codeBlockBg: "#161b22",
        codeBlockColor: "#c9d1d9",
        blockquoteColor: "#8b949e",
        blockquoteBg: "#0d1117",
        tableBorder: "#30363d",
        tableHeaderBg: "#161b22",
        tableBg: "#0d1117",
        tableN2Bg: "#161b22",
        tableN21Bg: "#0d1117",
        tableStriped: "#161b22",
        scrollbarThumb: "#484f58",
    },
}
