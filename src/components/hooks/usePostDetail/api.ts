/*
 * FilePath    : blog-client\src\components\hooks\usePostDetail\api.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 数据获取
 */

import { ref } from "vue"

import { viewPostByIDAPI, type ViewPostByIDRequest } from "@/api/post/viewByID"
import { ResponseCode } from "@/api/response"
import { type PostMetaProps } from "@/components/common/post-meta"
import { EditorStateManager } from "@/components/editor"

export function useGetData(manager: EditorStateManager) {
    const postMeta = ref<PostMetaProps>({}) // 文章元数据

    const getPostDetail = async (req: ViewPostByIDRequest) => {
        const res = await viewPostByIDAPI(req)
        if (res.data.code === ResponseCode.PostViewByIDSuccess) {
            const postData = res.data.data
            if (postData) {
                // 文章数据
                manager.updateState(postData.post_content)
                // 文章元数据
                postMeta.value = {
                    post_id: postData.id,
                    created_at: postData.created_at,
                    comment_count: postData.comment_count,
                    view_count: postData.view_count,
                    like_count: postData.like_count,
                    collect_count: postData.collect_count,
                    words_count: postData.words_count,
                    post_title: postData.post_title,
                    author_avatar: postData.author_info.user_avatar,
                    author_display_name: postData.author_info.user_display_name,
                    avatar_size: 20, // 头像大小，默认 24px
                    author_id: postData.author_info.id,
                    is_show_read_time: true,
                    // TODO: 判断是否启用作者
                    is_author_edit: true,
                    is_immersion_read: true,
                }
            }
            return res
        }
    }

    return {
        postMeta,
        getPostDetail,
    }
}
