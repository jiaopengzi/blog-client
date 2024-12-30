/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:09:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:09:14
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\view\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export interface ViewForm {
    id?: string // ID
    name: string // 名称
    slug: string // 别名
    description?: string // 描述
    thumbnail?: string // 缩略图
    order?: string // 排序
}
