/*
 * FilePath    : blog-client\src\views\admin\component\main\app-nav\nav-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 导航按钮
 */

import { IconKeys } from "@/components/common/icons"
import { type MenuItemWithIndex } from "@/components/common/recursive-menu-item"

export interface NavItemProps extends MenuItemWithIndex {
    is_enabled: boolean // 是否启用
    icon: {
        name?: IconKeys // 图标名称
        class?: string // 图标样式

        // icon 使用外部链接
        src?: string // 图标地址
        alt?: string // 图标提示

        style?: string // 图标样式
    }

    text_style?: string // 文本样式
}

export interface NavItemFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: NavItemProps
}
