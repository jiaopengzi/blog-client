/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\post-category\component\view\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 分类表单类型定义
 */

export interface ViewForm {
    id?: string // ID
    name: string // 名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
    parent?: string // 父级分类
}
