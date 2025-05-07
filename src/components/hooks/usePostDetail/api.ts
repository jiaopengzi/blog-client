/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\api.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 数据请求
 */

import { storeToRefs } from "pinia"
import { ref, watch } from "vue"

import { type InteractionRequest, postInteractionAPI } from "@/api/post/interaction"
import { type PostLikeRequest, setPostLikeAPI } from "@/api/post/like"
import { prevNextPostAPI, type PrevNextRequest, type PrevNextResponse } from "@/api/post/prevNext"
import { type PostStarRequest, setPostStarAPI } from "@/api/post/star"
import { viewPostByIDAPI, type ViewPostByIDRequest } from "@/api/post/viewByID"
import { ResponseCode } from "@/api/response"
import { type PostMetaProps } from "@/components/common/post-meta"
import { EditorStateManager } from "@/components/editor"
import { useOptionsStore } from "@/stores/options"
import { usePermissionRoleStore } from "@/stores/permissionRole"
import { updateHead } from "@/utils/updateHead"
import { type CategoryTagProps } from "@/views/home/main-content/post-detail/component/category-tag"
import { type CopyrightProps } from "@/views/home/main-content/post-detail/component/copyright"
import { type UpdatedAtProps } from "@/views/home/main-content/post-detail/component/updated-at"

export function useGetData(manager: EditorStateManager) {
    const postMeta = ref<PostMetaProps>({}) // 文章元数据

    const optionsStore = useOptionsStore()
    const { head } = storeToRefs(optionsStore)

    const copyright = ref<CopyrightProps>({
        title: "",
        url: "",
        author: {
            name: "",
            avatar: "",
            size: 40, // 头像大小
        },
    }) // 版权信息

    const prevNext = ref<PrevNextResponse>({} as PrevNextResponse) // 上一篇和下一篇文章信息
    const updatedAt = ref<UpdatedAtProps>({
        time: "",
        timeZone: "Asia/Shanghai",
        formatStr: "YYYY-MM-DD HH:mm:ss",
    }) // 更新时间

    const categoryTag = ref<CategoryTagProps>({
        categories: [], // 文章分类
        tags: [], // 文章标签
    })

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
                head.value.title = postData.post_title
                head.value.description = postData.seo_description
                head.value.keywords = postData.seo_keywords
                head.value.type = "article"
                head.value.locale = "zh-CN"
                head.value.author = postData.author_info.user_display_name
                head.value.image = postData.thumbnail
                head.value.siteName = postData.post_title
                // url 已经在路由中间件 head 组件 中自动设置
                head.value.releaseDate = postData.updated_at

                // 版权信息
                copyright.value.title = postData.post_title
                copyright.value.author.name = postData.author_info.user_display_name
                copyright.value.author.avatar = postData.author_info.user_avatar

                // 如果更新时间和创建时间不一致，则更新时间显示为更新时间
                if (postData.created_at !== postData.updated_at) {
                    updatedAt.value.time = postData.updated_at
                }

                // 更新分类和标签
                categoryTag.value.categories = postData.categories
                categoryTag.value.tags = postData.tags
            }
        }
    }

    // 更新 copyright 信息中的 url
    watch(
        () => head.value,
        (newVal) => {
            if (newVal.url) {
                copyright.value.url = newVal.url
            }
        },
    )

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
        await updateHead(head.value)
    }

    // 获取上一篇和下一篇文章信息
    const getPrevNext = async (req: PrevNextRequest) => {
        const res = await prevNextPostAPI(req)
        if (res.data.code === ResponseCode.PostPrevNextSuccess) {
            prevNext.value = res.data.data
        }
    }

    return {
        postMeta, // 文章元数据
        copyright, // 版权信息
        prevNext, // 上一篇和下一篇文章信息
        updatedAt, // 更新时间
        categoryTag, // 分类和标签
        getPostDetail, // 获取文章详情
        updatePostInteraction, // 更新文章交互状态
        setPostLike, // 设置文章点赞
        setPostStar, // 设置文章收藏
        updateHeadInfo, // 更新头部信息
        getPrevNext, // 获取上一篇和下一篇文章信息
    }
}
