/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-05 14:06:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 14:35:42
 * @FilePath     : \blog-client\my.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export interface ViewPostByAdminRequest {
    post_author?: string // 文章作者
    post_status?: number // 文章状态
    is_pinned?: boolean // 是否置顶
    is_recommended?: boolean // 是否推荐
}

// 获取对象中的值为 number 或 number | undefined 类型的键名
export type BooleanKeys<T> = {
    [K in keyof T]: T[K] extends boolean | undefined ? K : never
}[keyof T]

const queryBoolParams: BooleanKeys<ViewPostByAdminRequest>[] = ["is_pinned", "is_recommended"]
