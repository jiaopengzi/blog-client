/**
 * FilePath    : blog-client-dev\src\theme\presets\shared\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题预设相关的工具函数
 */

import type { ThemePreset, ThemePresetId } from "./types"

export function isThemePresetId(value: string, themePresetMap: Record<ThemePresetId, ThemePreset>): value is ThemePresetId {
    return value in themePresetMap
}

export function getThemePresetById(presetId: ThemePresetId, themePresetMap: Record<ThemePresetId, ThemePreset>): ThemePreset {
    return themePresetMap[presetId]
}
