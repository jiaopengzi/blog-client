/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\light.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 默认亮色主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const lightPreset: ThemePreset = {
    id: "light",
    label: "Light",
    description: "默认亮色主题",
    scheme: "light",
    palette: {
        primary: "#1e2858",
        secondary: "#c89828",
        success: "#67c23a",
        warning: "#e6a23c",
        danger: "#f56c6c",
        error: "#f56c6c",
        info: "#909399",
        footnoteSup: "#0969da",
        codeBg: "#dddddd",
        codeText: "#d63200",
        blockquoteBorder: "#f66",
        alertImportant: "#ab7df8",
    },
}
