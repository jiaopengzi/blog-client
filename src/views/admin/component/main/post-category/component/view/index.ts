/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:47:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 10:22:29
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\view\index.ts
 * @Description  : 编辑分类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

export interface ViewForm {
    id?: string // ID
    name: string // 名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
    parent?: string // 父级分类
}
