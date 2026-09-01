/*
 * FilePath    : blog-client-nuxt\src\components\hooks\usePostDetail\api.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情数据请求
 */

import { storeToRefs } from "pinia"
import { type Ref, ref, watch } from "vue"

import { CommentStatusCode, getPostDisplayTime, type PostResByID } from "@/api/post/common"
import { type InteractionRequest, postInteractionAPI } from "@/api/post/interaction"
import { type PostLikeRequest, setPostLikeAPI } from "@/api/post/like"
import { prevNextPostAPI, type PrevNextRequest, type PrevNextResponse } from "@/api/post/prevNext"
import { type PostStarRequest, setPostStarAPI } from "@/api/post/star"
import { viewPostByIDAPI, type ViewPostByIDRequest } from "@/api/post/viewByID"
import { ResponseCode } from "@/api/response"
import { type CategoryTagProps } from "@/components/common/post-detail/components/category-tag"
import { type CopyrightProps } from "@/components/common/post-detail/components/copyright"
import { type UpdatedAtProps } from "@/components/common/post-detail/components/updated-at"
import { emptyPostMetaProps, type PostMetaProps } from "@/components/common/post-meta"
import { EditorStateManager } from "@/components/editor/state"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { PostDetailEditCacheScope, usePermissionRoleStore } from "@/stores/permissionRole"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"
import { updateHead } from "@/utils/updateHead"

/**
 * useGetData 管理文章详情页所需的数据拉取与状态同步
 * 包括文章详情, 交互状态, SEO 信息以及文章详情编辑权限的同步
 * @param manager - 编辑器状态管理器实例
 * @param hash - 当前路由 hash 的响应式引用
 * @returns 返回文章详情相关的状态与操作方法集合
 */
export function useGetData(manager: EditorStateManager, hash: Ref<string>) {
    const router = useRouter()
    const postMeta = ref<PostMetaProps>(emptyPostMetaProps()) // 文章元数据
    const isPasswordPost = ref<boolean>(false) // 是否是密码保护文章
    // feature02 水合修复: 浏览量由 view-by-id 接口计数, SSR 与 payload 两次渲染会各计一次,
    // 首帧渲染其值不一致会产生 hydration text mismatch; 改为首帧置空, 水合完成后由 PostDetail 回填
    const latestViewCount = ref("") // 最近一次接口返回的浏览量

    const optionsStore = useOptionsStore()
    const deviceStore = useDeviceStore()
    const userStore = useUserStore()

    const { head } = storeToRefs(optionsStore)
    const { device } = storeToRefs(deviceStore)
    const { accessToken } = storeToRefs(userStore)

    // 站点基准 URL: head.url 与版权信息/分享链接拼接使用(feature02, 复刻 SPA updateHead 路由中间件行为)
    const runtimeConfig = useRuntimeConfig()
    const baseUrl = String(runtimeConfig.public.baseUrl || "").replace(/\/+$/, "")

    // 版权信息
    const copyright = ref<CopyrightProps>({
        title: "",
        url: "",
        author: {
            name: "",
            avatar: "",
            size: 40, // 头像大小
        },
    })

    // 上一篇和下一篇文章信息
    const prevNext = ref<PrevNextResponse>({} as PrevNextResponse)

    // 更新时间
    const updatedAt = ref<UpdatedAtProps>({
        time: "",
        timeZone: "Asia/Shanghai",
        formatStr: "YYYY-MM-DD HH:mm:ss",
    })

    const categoryTag = ref<CategoryTagProps>({
        categories: [], // 文章分类
        tags: [], // 文章标签
    })

    // 评论状态
    const commentStatus = ref<CommentStatusCode>(CommentStatusCode.Close)

    const permissionRoleStore = usePermissionRoleStore()

    /**
     * getPostDetailEditCacheScope 获取当前文章详情编辑权限缓存作用域
     * 登录用户使用已认证作用域, 未登录用户使用匿名作用域
     * @returns 当前登录态对应的权限缓存作用域
     */
    const getPostDetailEditCacheScope = (): PostDetailEditCacheScope => {
        return accessToken.value ? PostDetailEditCacheScope.Authenticated : PostDetailEditCacheScope.Anonymous
    }

    /**
     * syncPostDetailEditEnable 同步文章详情页的编辑权限标记
     * 会根据当前登录态选择对应缓存作用域, 并回写到 postMeta.is_author_edit
     * @returns Promise 在权限同步完成后结束
     */
    const syncPostDetailEditEnable = async () => {
        postMeta.value.is_author_edit = await permissionRoleStore.postDetailEditEnable(getPostDetailEditCacheScope())
    }

    /**
     * applyPostData 将接口返回的文章数据应用到详情页状态(正文渲染/元数据/版权/分类标签等)
     * feature02: 该函数为 SSR 与客户端共用的应用入口, SSR 渲染与客户端水合走同一实现, 保证首帧一致
     * 原 updatePostDetail 逻辑等价移植, 仅新增服务端守卫与 head 回退
     * @param postData 文章详情数据
     * @returns Promise 在状态应用完成后结束
     */
    const applyPostData = async (postData: PostResByID) => {
        if (!postData) {
            return
        }

        // 文章数据
        manager.updateState(postData.post_content)

        // 文章元数据
        const displayTime = getPostDisplayTime(postData)
        postMeta.value.post_id = postData.id
        postMeta.value.created_at = displayTime
        postMeta.value.comment_count = postData.comment_count
        postMeta.value.is_comment_status_open = postData.comment_status === CommentStatusCode.Open
        // feature02 水合修复: 浏览量首帧不写入, 记录最新值待客户端水合后回填
        latestViewCount.value = postData.view_count
        postMeta.value.like_count = postData.like_count
        postMeta.value.star_count = postData.star_count
        postMeta.value.words_count = postData.words_count
        postMeta.value.post_title = postData.post_title
        postMeta.value.author_avatar = postData.author_info.user_avatar
        postMeta.value.author_display_name = postData.author_info.user_display_name
        postMeta.value.avatar_size = device.value === DeviceType.PHONE ? 18 : 24 // 头像大小: phone 端 18px, 其他 24px
        postMeta.value.author_id = postData.author_info.id
        postMeta.value.author_user_name = postData.author_info.user_name
        postMeta.value.is_show_read_time = true
        postMeta.value.is_immersion_read = true
        postMeta.value.is_paid = postData.is_paid
        postMeta.value.price = postData.price
        postMeta.value.pay_strategy = postData.pay_strategy
        postMeta.value.pay_roles = postData.pay_roles || []

        watch(
            () => accessToken.value,
            async (newVal, oldVal) => {
                if (newVal === oldVal || !postMeta.value.post_id) {
                    return
                }

                await syncPostDetailEditEnable()
            },
        )
        head.value.title = postData.post_title
        head.value.description = postData.seo_description
        head.value.keywords = postData.seo_keywords
        head.value.type = "article"
        head.value.locale = "zh-CN"
        head.value.author = postData.author_info.user_display_name
        // feature01: 分享图默认使用文章缩略图; 无缩略图时取正文第一张图片(封面缺失的常见场景).
        // manager.updateState 已经 renderMarkdownDocument 管线提取了全部图片到 imgUrls (与编辑器
        // "从文章中选择缩略图" 同源), 直接取 imgUrls[0], 不再另行正则提取; 仍无图时回退主站 logo.
        head.value.image = postData.thumbnail || manager.getState().imgUrls[0] || optionsStore.getLogo
        head.value.siteName = postData.post_title
        head.value.releaseDate = displayTime
        // feature02: 复刻 SPA updateHead 路由中间件, head.url 指向当前文章地址, 供版权信息/分享链接拼接
        head.value.url = baseUrl + "/p/" + postData.id

        // 版权信息
        copyright.value.title = postData.post_title
        copyright.value.author.name = postData.author_info.user_display_name
        copyright.value.author.avatar = postData.author_info.user_avatar

        // 详情页底部固定展示更新时间, 新建文章的更新时间可能与展示时间相同
        updatedAt.value.time = postData.updated_at

        // 更新分类和标签
        categoryTag.value.categories = postData.categories && postData.categories.length > 0 ? postData.categories : []
        categoryTag.value.tags = postData.tags && postData.tags.length > 0 ? postData.tags : []

        // 更新评论状态
        commentStatus.value = postData.comment_status

        // 付费视频目录
        postMeta.value.videoToc = postData.video_toc && postData.video_toc.toc.length > 0 ? postData.video_toc.toc : []

        // 编辑权限同步(feature02, 客户端异步): 不阻塞首帧渲染, 与水合首帧一致(SSR 恒为默认 false),
        // 服务端跳过(不发起权限请求), 客户端水合后异步回写 postMeta.is_author_edit
        if (typeof window !== "undefined") {
            void syncPostDetailEditEnable()
        }
    }

    const getPostDetail = async (req: ViewPostByIDRequest) => {
        const res = await viewPostByIDAPI(req)

        if (res.data.code === ResponseCode.PostViewByIDSuccess) {
            // 密码保护设置为 false
            isPasswordPost.value = false
            await applyPostData(res.data.data)
        } else if (res.data.code === ResponseCode.PostViewPasswordIsEmpty) {
            // 密码保护文章
            isPasswordPost.value = true
            await applyPostData(res.data.data)
        } else if (res.data.code === ResponseCode.PostViewPasswordIsError) {
            // 密码保护文章
            isPasswordPost.value = true
            await applyPostData(res.data.data)
            MessageUtil.warning("请输入正确文章密码访问")
        } else {
            router.push({ name: RouteNames.NotFound })
        }
    }

    // setIsPasswordPost 设置密码保护标记(feature02: 页面 SSR 数据流根据响应码驱动该标记)
    const setIsPasswordPost = (val: boolean) => {
        isPasswordPost.value = val
    }

    // 更新 copyright 信息中的 url
    watch(
        () => head.value,
        (newVal) => {
            if (newVal.url) {
                // 去掉 hash.value 的第一个字符 (即 #, 不能使用替换, 万一后续还有 #)
                const rawHash = hash.value.slice(1)

                // 重新编码
                const encodedHash = encodeURIComponent(rawHash)

                // 替换掉 url 中的已经编码的 hash 值
                const replacedUrl = newVal.url.replace(`#${encodedHash}`, "")

                copyright.value.url = replacedUrl
            }
        },
    )

    watch(
        () => device.value,
        (newVal) => {
            // 如果是手机设备, 则不显示版权信息中的头像
            if (newVal === DeviceType.PHONE) {
                postMeta.value.formatStr = "YYYY-MM-DD"
            } else {
                postMeta.value.formatStr = "YYYY-MM-DD HH:mm:ss"
            }
        },
        { immediate: true },
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
        isPasswordPost, // 是否是密码保护文章
        latestViewCount, // 最近一次接口返回的浏览量(feature02: 水合后回填)
        applyPostData, // 应用文章数据(feature02: SSR/客户端共用入口)
        setIsPasswordPost, // 设置密码保护标记(feature02: 页面 SSR 数据流驱动)
        copyright, // 版权信息
        prevNext, // 上一篇和下一篇文章信息
        updatedAt, // 更新时间
        categoryTag, // 分类和标签
        commentStatus, // 评论状态
        getPostDetail, // 获取文章详情
        updatePostInteraction, // 更新文章交互状态
        setPostLike, // 设置文章点赞
        setPostStar, // 设置文章收藏
        updateHeadInfo, // 更新头部信息
        getPrevNext, // 获取上一篇和下一篇文章信息
    }
}
