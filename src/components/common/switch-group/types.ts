/**
 * @FilePath     : \blog-client\src\components\common\switch-group\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 开关组件类型
 */

import { IconKeys } from "@/components/common/icons"

type NamePosition = "left" | "right"

// 组件参数
export interface SwitchItem {
    name: string
    display?: string
    status: boolean
    namePosition?: NamePosition
    label?: SwitchItemLabel
    icon?: SwitchItemIcon
    color?: SwitchItemColor
    minWidth?: string | number
}

// 自定义标签
export interface SwitchItemLabel {
    active?: string
    inactive?: string
}

export interface SwitchItemIcon {
    active?: IconKeys
    activeClassName?: string
    inactive?: IconKeys
    inactiveClassName?: string
}

// 自定义颜色
export interface SwitchItemColor {
    active?: string
    inactive?: string
}
