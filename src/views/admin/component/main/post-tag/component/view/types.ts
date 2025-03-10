/**
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\view\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

export interface ViewForm {
    id?: string // ID
    name: string // 名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
}
