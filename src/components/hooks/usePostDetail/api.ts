/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\api.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 数据请求
 */

import { ref } from "vue"

import { type InteractionRequest, postInteractionAPI } from "@/api/post/interaction"
import { type PostLikeRequest, setPostLikeAPI } from "@/api/post/like"
import { type PostStarRequest, setPostStarAPI } from "@/api/post/star"
import { viewPostByIDAPI, type ViewPostByIDRequest } from "@/api/post/viewByID"
import { ResponseCode } from "@/api/response"
import { type HeadProps } from "@/components/common/head-tag"
import { type PostMetaProps } from "@/components/common/post-meta"
import { EditorStateManager } from "@/components/editor"
import { usePermissionRoleStore } from "@/stores/permissionRole"
import { updateHead } from "@/utils/updateHead"

export function useGetData(manager: EditorStateManager) {
    const postMeta = ref<PostMetaProps>({}) // 文章元数据
    const headMeta = ref<HeadProps>({}) // 文章头部信息
    const permissionRoleStore = usePermissionRoleStore()

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
                    star_count: postData.star_count,
                    words_count: postData.words_count,
                    post_title: postData.post_title,
                    author_avatar: postData.author_info.user_avatar,
                    author_display_name: postData.author_info.user_display_name,
                    avatar_size: 20, // 头像大小，默认 24px
                    author_id: postData.author_info.id,
                    is_show_read_time: true,
                    is_author_edit: await permissionRoleStore.postDetailEditEnable(),
                    is_immersion_read: true,
                    interactionStatus: {
                        is_like: false,
                        is_star: false,
                    },
                }

                // 文章头部信息
                headMeta.value = {
                    title: postData.post_title,
                    description: postData.seo_description,
                    keywords: postData.seo_keywords,
                    type: "article",
                    locale: "zh-CN",
                    author: postData.author_info.user_display_name,
                    image: postData.thumbnail,
                    siteName: postData.post_title,
                    // url 已经在路由中间件中自动设置
                    releaseDate: postData.updated_at,
                }
            }
        }
    }

    // 更新文章交互状态
    const updatePostInteraction = async (req: InteractionRequest) => {
        const res = await postInteractionAPI(req)
        if (res.data.code === ResponseCode.PostInteractionStatusSuccess) {
            const interactionData = res.data.data
            if (interactionData && postMeta.value.interactionStatus) {
                // 更新交互状态
                postMeta.value.interactionStatus.is_like = interactionData.like
                postMeta.value.interactionStatus.is_star = interactionData.star
            }
        }
    }

    // 设置文章点赞
    const setPostLike = async (req: PostLikeRequest) => {
        const res = await setPostLikeAPI(req)
        if (res.data.code === ResponseCode.PostLikeSuccess || res.data.code === ResponseCode.PostLikeCancelSuccess) {
            const data = res.data.data
            if (data && postMeta.value.interactionStatus) {
                // 更新交互状态
                postMeta.value.interactionStatus.is_like = req.like
                postMeta.value.like_count = data.count
            }
        }
    }

    // 设置文章收藏
    const setPostStar = async (req: PostStarRequest) => {
        const res = await setPostStarAPI(req)
        if (res.data.code === ResponseCode.PostStarSuccess || res.data.code === ResponseCode.PostStarCancelSuccess) {
            const data = res.data.data
            if (data && postMeta.value.interactionStatus) {
                // 更新交互状态
                postMeta.value.interactionStatus.is_star = req.star
                postMeta.value.star_count = data.count
            }
        }
    }

    const updateHeadInfo = async () => {
        await updateHead(headMeta.value)
    }

    return {
        postMeta, // 文章元数据
        headMeta, // 文章头部信息
        getPostDetail, // 获取文章详情
        updatePostInteraction, // 更新文章交互状态
        setPostLike, // 设置文章点赞
        setPostStar, // 设置文章收藏
        updateHeadInfo, // 更新头部信息
    }
}
