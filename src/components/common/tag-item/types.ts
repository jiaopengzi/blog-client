/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:27:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:27:12
 * @FilePath     : \blog-client\src\components\common\tag-item\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type PostTag } from "@/api/postTag/view"

// 标签颜色对象
export type TagColor = { color: string; bgColor: string }

// 标签对象
export type Tag = { data: PostTag; color: TagColor }
