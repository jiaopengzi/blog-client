/*
 * FilePath    : blog-client\src\components\common\post-upsert\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具
 */

import { CommentStatusCode, PostStatusCode, PostType } from "@/api/post/common"

import { type UpsertPostForm } from "./types"

// 创建 empty InsertPostRequest
export function createEmptyUpsertPostForm(postType: PostType): UpsertPostForm {
    const emptyForm: UpsertPostForm = {
        id: "",
        post_author: "",
        post_content: "",
        post_title: "",
        post_status: PostStatusCode.Draft,
        post_password: "",
        comment_status: CommentStatusCode.Open,
        price: 0,
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
        post_type: PostType.Post,
        video_toc: [
            {
                id: 1,
                label: "目录",
                is_chapter: true,
            },
        ],
        video_file_id_hash_list: [],
    }

    emptyForm.post_type = postType
    if (postType === PostType.Page || postType === PostType.Video) {
        emptyForm.comment_status = CommentStatusCode.Close
    }

    return emptyForm
}
