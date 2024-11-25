/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 11:05:03
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\view\index.ts
 * @Description  : 编辑标签
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
}
