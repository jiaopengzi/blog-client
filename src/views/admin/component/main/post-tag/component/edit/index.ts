/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:46:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-05 10:03:02
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\edit\index.ts
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export { default } from "./index.vue"

export interface EditForm {
    id: number // ID
    name: string // tag名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: number // 排序
}
