/*
 * FilePath    : blog-client\src\components\common\post-upsert\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具
 */

import { CommentStatusCode, PayStrategy, PostStatusCode, PostType } from "@/api/post/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"
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
        pay_strategy: PayStrategy.Buy,
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
        video_toc: [],
        video_file_id_hash_list: [],
    }

    emptyForm.post_type = postType
    if (postType === PostType.Page || postType === PostType.Video) {
        emptyForm.comment_status = CommentStatusCode.Close
    }

    return emptyForm
}

/**
 * 统一处理文章新增和编辑时的错误提示.
 * @param res 接口响应对象.
 */
export function handlePostUpsertError(res: { data: { code: number; msg: string; data?: { msg?: string } } }) {
    if (res.data.code === ResponseCode.PayStrategyValidateFailed) {
        if (res.data.data?.msg) {
            MessageUtil.error(`${res.data.msg}，${res.data.data.msg}`, 0)
            return
        }
        MessageUtil.error(res.data.msg, 0)
        return
    }

    MessageUtil.error(handleResErr(res as never), 0)
}
