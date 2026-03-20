/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\dark.ts
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
    },
}
