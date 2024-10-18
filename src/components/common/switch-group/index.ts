/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 16:36:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-18 10:05:12
 * @FilePath     : \blog-client\src\components\common\switch-group\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

type NamePosition = "left" | "right"

// 组件参数
export interface SwitchItem {
    name?: string
    status: boolean
    namePosition?: NamePosition
    label?: SwitchItemLabel
    color?: SwitchItemColor
}

// 自定义标签
export interface SwitchItemLabel {
    labelTrue?: string
    labelFalse?: string
}

// 自定义颜色
export interface SwitchItemColor {
    colorTrue?: string
    colorFalse?: string
}
