/*
 * FilePath    : blog-client\src\components\common\post-detail\components\category-tag\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 分类和标签类型定义
 */

import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type TagBase } from "@/components/common/tag-item-base"

export type CategoryTagProps = {
    categories: PostCategory[] // 文章分类
    tags: PostTag[] // 文章标签
}

export interface CategoryTagItem extends TagBase {
    type: "category" | "tag" // 分类或标签
    srcData: PostCategory | PostTag // 分类或标签数据
}
