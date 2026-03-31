/**
 * FilePath    : blog-client\src\theme\presets\definitions\dark.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 默认暗色主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const darkPreset: ThemePreset = {
    id: "dark",
    label: "Dark",
    description: "默认暗色主题",
    scheme: "dark",
    palette: {
        primary: "#c89828",
        secondary: "#bb1818",
        success: "#67c23a",
        warning: "#e6a23c",
        danger: "#f56c6c",
        error: "#f56c6c",
        info: "#909399",
        footnoteSup: "#2f81f7",
        codeBg: "#2d333b",
        codeText: "#ffae57",
        blockquoteBorder: "#f85149",
        alertImportant: "#ab7df8",
        bg: "var(--el-bg-color)",
        bgPage: "var(--el-bg-color-page)",
        bgFooter: "var(--el-bg-color)",
        bgOverlay: "var(--el-bg-color-overlay)",
        border: "var(--el-border-color)",
        borderHover: "var(--el-border-color-hover)",
        borderLighter: "var(--el-border-color-lighter)",
        shadowLighter: "var(--el-box-shadow-lighter)",
        shadowLight: "var(--el-box-shadow-light)",
        shadow: "var(--el-box-shadow)",
        fillLighter: "var(--el-fill-color-lighter)",
        textPrimary: "var(--el-text-color-primary)",
        textRegular: "var(--el-text-color-regular)",
        textSecondary: "var(--el-text-color-secondary)",
        textPlaceholder: "var(--el-text-color-placeholder)",
        textDisabled: "var(--el-text-color-disabled)",
        codeBlockBg: "var(--el-bg-color-page)",
        codeBlockColor: "var(--el-bg-color-page)",
        blockquoteColor: "var(--el-text-color-primary)",
        blockquoteBg: "var(--el-bg-color-page)",
        tableBorder: "var(--el-border-color)",
        tableHeaderBg: "var(--el-bg-color-page)",
        tableBg: "var(--el-bg-color)",
        tableN2Bg: "var(--el-bg-color-page)",
        tableN21Bg: "var(--el-bg-color)",
        tableStriped: "var(--el-bg-color-page)",
        scrollbarThumb: "var(--el-border-color-darker)",
    },
}
