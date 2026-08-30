/*
 * FilePath    : blog-client-nuxt\src\theme\presets\index.nuxt.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Nuxt 环境灰度示范测试 (P1-6 nuxt4-good)
 */

/*
 * 补充说明:
 * *.nuxt.test.ts 后缀经 vitest environmentMatchGlobs 走 vitest-environment-nuxt
 * —— 真实 Nuxt 运行时 (auto-imports/composables), 无需手工 stub #imports。
 * 覆盖主题预设数据完整性 + 260828 的 G1 映射约束回归
 */

import { describe, expect, it } from "vitest"

import { defaultThemePresetId, getThemePreset, isValidThemePresetId, themePresetList } from "@/theme/presets"
import { buildThemePresetStyleContent } from "@/theme/runtime"

describe("theme presets (nuxt environment)", () => {
    it("预设列表包含默认预设且 id 唯一", () => {
        expect(themePresetList.length).toBeGreaterThan(1)
        const ids = themePresetList.map((preset) => preset.id)
        expect(new Set(ids).size).toBe(ids.length)
        expect(ids).toContain(defaultThemePresetId)
    })

    it("getThemePreset 合法性校验(未知 id 返回 undefined, 调用方需经 isValidThemePresetId 守卫)", () => {
        expect(getThemePreset(defaultThemePresetId).id).toBe(defaultThemePresetId)
        expect(isValidThemePresetId(defaultThemePresetId)).toBe(true)
        expect(isValidThemePresetId("__not_exist__")).toBe(false)
    })

    it("buildThemePresetStyleContent 产出带预设 id 选择器的 CSS 变量文本", () => {
        const css = buildThemePresetStyleContent(getThemePreset(defaultThemePresetId))
        expect(css).toContain(`html[data-theme="${defaultThemePresetId}"]`)
        expect(css).toContain("--jpz-color-primary")
        // 顺序修复(260828)约束: primary 一族不直供 --el-color-primary, 交 main.scss G1 映射
        expect(css).not.toContain("--el-color-primary:")
    })
})
