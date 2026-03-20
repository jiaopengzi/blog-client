/**
 * FilePath    : blog-client-dev\src\theme\presets\definitions\tokyonight-day.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : TokyoNight 日间主题预设定义
 */

import type { ThemePreset } from "../shared/types"

export const tokyonightDayPreset: ThemePreset = {
    id: "tokyonight-day",
    label: "TokyoNight Day",
    description: "TokyoNight 日间主题",
    scheme: "light",
    palette: {
        primary: "#34548a",
        secondary: "#33635c",
        success: "#33635c",
        warning: "#8f5e15",
        danger: "#8c4351",
        error: "#8c4351",
        info: "#6172b0",
        footnoteSup: "#34548a",
        codeBg: "#dfe7f5",
        codeText: "#34548a",
        blockquoteBorder: "#8c4351",
        alertImportant: "#5a4a78",
    },
}
