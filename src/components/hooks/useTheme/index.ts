/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-10 15:08:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-10 15:24:10
 * @FilePath     : \blog-client\src\components\hooks\useTheme\index.ts
 * @Description  : 主题切换
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive } from "vue"
import { IconKeys } from "@/components/common/icons"
import { useDark, useToggle } from "@vueuse/core"
import type { SwitchItem, SwitchItemIcon, SwitchItemColor } from "@/components/common/switch-group"

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
    const updateStatus = (items: SwitchItem[]) => {
        toggleDark()
    }

    return {
        themeSwitch,
        updateStatus,
    }
}
