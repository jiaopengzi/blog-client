/*
 * FilePath    : blog-client\src\components\common\nav-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { IconKeys } from "@/components/common/icons"

// 导航图标类型
export interface NavItemProps {
    text: string

    // 内容在左侧还是右侧, 默认在右侧
    text_position: "left" | "right"

    // icon 使用外部链接
    href?: string
    icon_src?: string
    icon_alt?: string
    style?: string
    target?: "_blank" | "_self" | "_parent" | "_top"

    // 使用内部路由
    RouteName?: string
    iconKey?: IconKeys
    customClass?: string
}
