/**
 * @FilePath     : \blog-client\src\components\hooks\useTheme\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 主题切换
 */

import { useDark, useToggle } from "@vueuse/core"
import { computed, reactive } from "vue"

import { IconKeys } from "@/components/common/icons"
import type { SwitchItem, SwitchItemColor, SwitchItemIcon } from "@/components/common/switch-group"
import { getTheme, Theme, ThemeMode } from "@/pkg/codemirror"

// 主题切换
export function useTheme() {
    const isDark = useDark()

    const toggleDark = useToggle(isDark)

    // switch 开关 标签
    const icon: SwitchItemIcon = {
        active: IconKeys.ThemeDark,
        inactive: IconKeys.ThemeLight,
    }

    // switch 开关 颜色
    const color: SwitchItemColor = {
        active: "var(--jpz-text-color-placeholder)",
        inactive: "var(--jpz-text-color-placeholder)",
    }

    // switch 开关
    const themeSwitch: SwitchItem[] = reactive([
        {
            name: "themeSwitch",
            status: isDark.value,
            color: color,
            icon: icon,
        },
    ])

    // 更新菜单折叠状态
    const updateStatus = () => {
        toggleDark()
    }

    // 计算主题
    const theme = computed(() => {
        const mode = isDark.value ? ThemeMode.Dark : ThemeMode.Light
        return getTheme(Theme.MD, mode)
    })

    return {
        isDark,
        themeSwitch,
        updateStatus,
        theme,
    }
}
