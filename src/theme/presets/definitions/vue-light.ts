/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\vue-light.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Vue 绿色系明亮主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const vueLightPreset: ThemePreset = {
    id: "vue-light",
    label: "Vue Light",
    description: "Vue 绿色系明亮主题",
    scheme: "light",
    palette: {
        primary: "#42b883",
        secondary: "#f59e0b",
        success: "#42b883",
        warning: "#e7c000",
        danger: "#d9534f",
        error: "#d9534f",
        info: "#5c7080",
        footnoteSup: "#42b883",
        codeBg: "#e8f5ef",
        codeText: "#1f5f46",
        blockquoteBorder: "#42b883",
        alertImportant: "#6b8df2",
        bg: "#ffffff",
        bgPage: "#f9f9f9",
        bgFooter: "#ffffff",
        bgOverlay: "#f0f0f0",
        border: "#e2e2e2",
        borderHover: "#c8c8c8",
        borderLighter: "#f0f0f0",
        shadowLighter: "0 1px 3px rgba(0, 0, 0, 0.05)",
        shadowLight: "0 3px 6px rgba(0, 0, 0, 0.1)",
        shadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        fillLighter: "#f9f9f9",
        textPrimary: "#213547",
        textRegular: "#3c3c3c",
        textSecondary: "#767676",
        textPlaceholder: "#a8a8a8",
        textDisabled: "#a8a8a8",
        codeBlockBg: "#f9f9f9",
        codeBlockColor: "#213547",
        blockquoteColor: "#3c3c3c",
        blockquoteBg: "#ffffff",
        tableBorder: "#e2e2e2",
        tableHeaderBg: "#f9f9f9",
        tableBg: "#ffffff",
        tableN2Bg: "#f9f9f9",
        tableN21Bg: "#ffffff",
        tableStriped: "#f9f9f9",
        scrollbarThumb: "#c8c8c8",
    },
}
