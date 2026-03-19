/**
 * FilePath    : bf\c:\Desktop\blog-client-dev\src\components\common\phone-section-nav\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Component } from "vue"

export interface PhoneSectionNavItem {
    value: string // 导航项的值, 用于标识当前导航项.
    label: string // 导航项的标签, 用于显示在界面上.
    icon?: Component // 导航项的图标, 可选属性, 用于显示在标签前面.
}
