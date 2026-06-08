/**
 * FilePath    : blog-client\src\components\common\add-tag\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : add-tag 标签排序工具
 */

import { type PostTag } from "@/api/postTag/view"
import { sortPostTagsByCount } from "@/utils/postTagSort"

/**
 * 按管理员口径对标签列表排序.
 * @param tags - 待排序的标签列表.
 * @returns 新的排序结果, 不修改原始数组.
 */
export function sortPostTagsByAdminCount(tags: PostTag[]): PostTag[] {
    return sortPostTagsByCount(tags, "post_count_admin")
}
