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
        secondary: "#8cc5ff",
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
    },
}
