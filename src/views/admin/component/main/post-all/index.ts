/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-23 17:05:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-03 16:31:06
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\index.ts
 * @Description  : 查看所有文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

export interface PostCountGroup {
    display: string
    key: string
    count: number
    index: number
}
