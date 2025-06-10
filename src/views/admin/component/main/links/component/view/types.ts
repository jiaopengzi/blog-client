/*
 * FilePath    : blog-client\src\views\admin\component\main\links\component\view\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接展示组件类型
 */

import { LinkStatusCode } from "@/api/link/common"

export interface ViewForm {
    id?: string // ID
    name: string // 名称
    url: string // 别名
    thumbnail: string // 图片
    description: string // 描述
    status: LinkStatusCode // 状态
    order?: string // 排序
}
