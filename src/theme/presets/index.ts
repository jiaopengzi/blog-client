/**
 * FilePath    : blog-client-dev\src\theme\presets\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题预设的统一导出文件
 */

import { darkPreset } from "./definitions/dark"
import { githubDarkPreset } from "./definitions/github-dark"
import { githubLightPreset } from "./definitions/github-light"
import { lightPreset } from "./definitions/light"
import { tokyonightDayPreset } from "./definitions/tokyonight-day"
import { tokyonightNightPreset } from "./definitions/tokyonight-night"
import { vueDarkPreset } from "./definitions/vue-dark"
import { vueLightPreset } from "./definitions/vue-light"
import { getThemePresetById, isThemePresetId } from "./shared/utils"

import type { ThemePreset, ThemePresetId } from "./shared/types"

export type { ThemePalette, ThemePreset, ThemePresetId, ThemeScheme } from "./shared/types"

export const defaultThemePresetId: ThemePresetId = "light"

export const themePresetList: ThemePreset[] = [
    lightPreset,
    darkPreset,
    githubLightPreset,
    githubDarkPreset,
    vueLightPreset,
    vueDarkPreset,
    tokyonightDayPreset,
    tokyonightNightPreset,
]

export const themePresetMap: Record<ThemePresetId, ThemePreset> = themePresetList.reduce(
    (acc, preset) => {
        acc[preset.id] = preset
        return acc
    },
    {} as Record<ThemePresetId, ThemePreset>,
)

export const isValidThemePresetId = (value: string): value is ThemePresetId => isThemePresetId(value, themePresetMap)

export const getThemePreset = (presetId: ThemePresetId): ThemePreset => getThemePresetById(presetId, themePresetMap)
