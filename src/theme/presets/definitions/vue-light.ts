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
        secondary: "#35495e",
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
    },
}
