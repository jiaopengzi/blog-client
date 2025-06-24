/**
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import { CommentStatusCode, PostStatusCode } from "@/api/post/common"

import { type UpsertPostForm } from "./types"

// 创建 empty InsertPostRequest
export function createEmptyUpsertPostForm(): UpsertPostForm {
    return {
        id: "",
        post_author: "",
        post_content: "",
        post_title: "",
        post_status: PostStatusCode.Draft,
        post_password: "",
        comment_status: CommentStatusCode.Open,
        price: "",
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        slug: "",
        thumbnail: "",
        category_ids: [],
        tag_names: [],
        pay_roles: [],
        post_push_time: {
            Time: null,
            Valid: false,
        },
        post_expired_time: {
            Time: null,
            Valid: false,
        },
        is_pinned: 0,
        is_recommended: 0,
    }
}
