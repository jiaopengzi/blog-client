/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\vue-dark.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Vue 绿色系暗色主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const vueDarkPreset: ThemePreset = {
    id: "vue-dark",
    label: "Vue Dark",
    description: "Vue 绿色系暗色主题",
    scheme: "dark",
    palette: {
        primary: "#42d392",
        secondary: "#6366f1",
        success: "#42d392",
        warning: "#e7c000",
        danger: "#ff7875",
        error: "#ff7875",
        info: "#94a3b8",
        footnoteSup: "#42d392",
        codeBg: "#1f2933",
        codeText: "#9ef0c3",
        blockquoteBorder: "#42d392",
        alertImportant: "#8cc5ff",
        bg: "#1a1a1a",
        bgPage: "#242424",
        bgFooter: "#1a1a1a",
        bgOverlay: "#2f2f2f",
        border: "#3a3a3a",
        borderHover: "#4a4a4a",
        borderLighter: "#2a2a2a",
        shadowLighter: "0 1px 3px rgba(0, 0, 0, 0.4)",
        shadowLight: "0 3px 6px rgba(0, 0, 0, 0.5)",
        shadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
        fillLighter: "#2f2f2f",
        textPrimary: "#ffffff",
        textRegular: "#ebebeb",
        textSecondary: "#a8a8a8",
        textPlaceholder: "#7a7a7a",
        textDisabled: "#7a7a7a",
        codeBlockBg: "#242424",
        codeBlockColor: "#ffffff",
        blockquoteColor: "#ebebeb",
        blockquoteBg: "#1a1a1a",
        tableBorder: "#3a3a3a",
        tableHeaderBg: "#242424",
        tableBg: "#1a1a1a",
        tableN2Bg: "#242424",
        tableN21Bg: "#1a1a1a",
        scrollbarThumb: "#4a4a4a",
    },
}
