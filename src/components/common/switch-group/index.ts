/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 16:36:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-08 14:43:38
 * @FilePath     : \blog-client\src\components\common\switch-group\index.ts
 * @Description  : 开关组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from "@/components/common/icons"

export { default } from "./index.vue"

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
