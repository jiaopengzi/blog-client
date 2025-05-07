/**
 * @FilePath     : \blog-client\src\components\common\tag-item\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 标签组件
 */

// 标签颜色对象
export type TagColor = { color: string; bgColor: string }

// 标签对象
export interface TagBase {
    id: string
    display: string
}

// 标签对象
export interface Tag extends TagBase {
    color: TagColor
}
