/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\tokyonight-night.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : TokyoNight 夜间主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const tokyonightNightPreset: ThemePreset = {
    id: "tokyonight-night",
    label: "TokyoNight Night",
    description: "TokyoNight 夜间主题",
    scheme: "dark",
    palette: {
        primary: "#7aa2f7",
        secondary: "#73daca",
        success: "#9ece6a",
        warning: "#e0af68",
        danger: "#f7768e",
        error: "#f7768e",
        info: "#a9b1d6",
        footnoteSup: "#7aa2f7",
        codeBg: "#24283b",
        codeText: "#ff9e64",
        blockquoteBorder: "#f7768e",
        alertImportant: "#bb9af7",
    },
}
