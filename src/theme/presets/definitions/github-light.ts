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
        secondary: "#1f883d",
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
    },
}
