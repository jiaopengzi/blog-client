/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-15 11:23:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-15 12:58:31
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */
import { defineComponent } from "vue"

// tab 类型
export interface Tab {
    hash: string // 路由名称
    label?: string // 标签显示
    icon?: ReturnType<typeof defineComponent> // 图标
    component: ReturnType<typeof defineComponent> // 组件
}
