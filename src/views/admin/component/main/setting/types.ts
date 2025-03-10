/**
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { defineComponent } from "vue"

import { IconKeys } from "@/components/common/icons"

// tab 类型
export interface Tab {
    hash: string // 路由名称
    label?: string // 标签显示
    icon?: IconKeys // 图标
    component: ReturnType<typeof defineComponent> // 组件
}
