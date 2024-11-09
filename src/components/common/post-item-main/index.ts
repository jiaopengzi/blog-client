/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 14:45:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 16:52:01
 * @FilePath     : \blog-client\src\components\common\base\post-item-main\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

// 定义props 后续调用
export interface PostItemMainObj {
    id: string
    category: string
    categoryHref: string
    thumbnailSrc: string
    thumbnailHref: string
    title: string
    titleHref: string
    summary: string
    name: string
    avatar?: string
    date: string
    view: number
    readMoreHref: string
}
