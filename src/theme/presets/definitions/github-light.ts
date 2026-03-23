/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\github-light.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : GitHub 风格的明亮主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const githubLightPreset: ThemePreset = {
    id: "github-light",
    label: "GitHub Light",
    description: "GitHub 风格的明亮主题",
    scheme: "light",
    palette: {
        primary: "#0969da",
        secondary: "#d29922",
        success: "#1f883d",
        warning: "#9a6700",
        danger: "#cf222e",
        error: "#cf222e",
        info: "#57606a",
        footnoteSup: "#0969da",
        codeBg: "#ddf4ff",
        codeText: "#0a3069",
        blockquoteBorder: "#cf222e",
        alertImportant: "#8250df",
        bg: "#ffffff",
        bgPage: "#f6f8fa",
        bgFooter: "#ffffff",
        bgOverlay: "#f3f4f6",
        border: "#d0d7de",
        borderHover: "#8c959f",
        borderLighter: "#e5e7eb",
        shadowLighter: "0 1px 3px rgba(31, 35, 40, 0.1)",
        shadowLight: "0 3px 6px rgba(31, 35, 40, 0.15)",
        shadow: "0 8px 24px rgba(31, 35, 40, 0.12)",
        fillLighter: "#f6f8fa",
        textPrimary: "#1f2328",
        textRegular: "#656d76",
        textSecondary: "#57606a",
        textPlaceholder: "#8c959f",
        textDisabled: "#8c959f",
        codeBlockBg: "#f6f8fa",
        codeBlockColor: "#1f2328",
        blockquoteColor: "#656d76",
        blockquoteBg: "#ffffff",
        tableBorder: "#d0d7de",
        tableHeaderBg: "#f6f8fa",
        tableBg: "#ffffff",
        tableN2Bg: "#f6f8fa",
        tableN21Bg: "#ffffff",
        scrollbarThumb: "#afb8c1",
    },
}
