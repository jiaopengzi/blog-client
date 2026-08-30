/*
 * FilePath    : blog-client-nuxt\src\plugins\theme.client.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 阶段 0 最小主题应用插件 (仅客户端)
 */

/*
 * 补充说明:
 * 读取 localStorage 主题预设并应用到文档根节点;
 * 完整主题选择器 (useTheme + 代码块主题联动) 在阶段 3 迁移
 */

import { defaultThemePresetId, getThemePreset, isValidThemePresetId, type ThemePresetId } from "@/theme/presets"
import { applyThemePresetToDocument } from "@/theme/runtime"

export default defineNuxtPlugin(() => {
    // LocalStorageKey.ThemePreset (stores/local.ts 阶段 1 迁移后改引用枚举)
    const storedValue = localStorage.getItem("theme_preset")
    const presetId: ThemePresetId = storedValue && isValidThemePresetId(storedValue) ? storedValue : defaultThemePresetId

    applyThemePresetToDocument(getThemePreset(presetId))
})
