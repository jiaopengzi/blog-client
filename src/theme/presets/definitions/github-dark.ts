/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\github-dark.ts
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
        secondary: "#3fb950",
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
    },
}
