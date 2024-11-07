/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:05:03
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-07 17:10:56
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

interface PostInfo {
    id: string
    title: string
    seoTitle: string
    seoDescription: string
    seoKeyWord: string
    thumbnail: string
    price: number
    tagList: string[]
    categories: number[]
}
