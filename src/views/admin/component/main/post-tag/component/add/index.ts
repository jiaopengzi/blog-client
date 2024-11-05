/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 15:16:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-04 16:25:48
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\add\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export { default } from "./index.vue"

export interface AddForm {
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: number // 排序
}
