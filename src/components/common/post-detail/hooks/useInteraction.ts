/*
 * FilePath    : blog-client-nuxt\src\components\common\post-detail\hooks\useInteraction.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 交互相关的 hook
 */

import { storeToRefs } from "pinia"
import { computed, type ComputedRef, type Ref, ref, watch } from "vue"

import { type PostLikeRequest } from "@/api/post/like"
import { type PostStarRequest } from "@/api/post/star"
import { type PostMetaProps } from "@/components/common/post-meta"
import { useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"
import { useStatusStore } from "@/stores/status"
import { copyText } from "@/utils/clipboard"
import { MessageUtil } from "@/utils/message"

import { type InteractionIcon, type InteractionItemProps } from "../components/interaction"
import { PostDetailType } from "../types"

/**
 * 获取分享海报二维码中心 logo.
 * 优先使用 favicon, 其次使用站点 logo.
 * 仅允许常见图片格式, 其他情况返回空字符串, 避免移动端二维码渲染卡住.
 */
function getPosterQrLogoSrc(faviconSrc?: string, logoSrc?: string): string {
    const candidates = [faviconSrc, logoSrc]

    for (const candidate of candidates) {
        const normalizedSrc = String(candidate || "").trim()
        if (!normalizedSrc) {
            continue
        }

        const normalizedPath = (normalizedSrc.split("?")[0] || "").toLowerCase()
        const isSupportedImage = /\.(png|jpe?g|webp|gif|svg)$/.test(normalizedPath)

        if (isSupportedImage) {
            return normalizedSrc
        }
    }

    return ""
}

/**
 * @param postMeta 文章元数据
 * @param postId 文章ID
 * @param setPostLike 设置点赞
 * @param setPostStar 设置收藏
 * @param postDetailRef 文章详情页ref
 */
export function useInteraction(
    postMeta: Ref<PostMetaProps>,
    postId: Ref<string>,
    detailType: Ref<PostDetailType>,
    setPostLike: (req: PostLikeRequest) => Promise<void>,
    setPostStar: (req: PostStarRequest) => Promise<void>,
    postDetailRef: Ref<HTMLElement | null>,
) {
    const userStore = useUserStore()
    const optionsStore = useOptionsStore()
    const deviceStore = useDeviceStore()
    const statusStore = useStatusStore()

    const { windowWidth } = storeToRefs(deviceStore)
    const { head, app_options } = storeToRefs(optionsStore)

    const { isLogin } = storeToRefs(userStore)

    // 交互项列表
    const interactionItems: ComputedRef<InteractionItemProps[]> = computed(() => {
        const result: InteractionItemProps[] = [
            {
                icon: "like",
                text: "点赞",
                isActive: postMeta.value.interactionStatus?.is_like,
                tip: postMeta.value.like_count,
                isShow: app_options.value.like_enable.value === "true",
            },
            {
                icon: "star",
                text: "收藏",
                isActive: postMeta.value.interactionStatus?.is_star,
                tip: postMeta.value.star_count,
                isShow: app_options.value.star_enable.value === "true",
            },
            {
                icon: "share",
                text: "分享",
                isShow: app_options.value.share_poster_enable.value === "true",
            },
            {
                icon: "link",
                text: "复制链接",
                isShow: app_options.value.link_enable.value === "true",
            },
        ]

        // 判断是否为全部都不显示, statusStore 中设置为 false
        if (result.every((item) => !item.isShow)) {
            statusStore.setShowDetailInteraction(false)
        }

        return result.filter((item) => item.isShow)
    })

    const isShowPosterShare = ref(false)

    const handPosterComplete = () => {
        isShowPosterShare.value = false
    }

    const dataPosterShare = computed(() => {
        return {
            logoSrc: getPosterQrLogoSrc(app_options.value.favicon.value, app_options.value.logo.value),
            imgSrc: head.value.image,
            titleText: postMeta.value.post_title,
            urlText: shareUrl.value,
        }
    })

    /**
     * 生成可对外分享的稳定链接.
     * 文章详情使用 nuxt 详情路由 `/p/:postId` (SPA 时代的 `/post/:id` 已降级为 legacy 301,
     * 分享链接应直达新路由, 避免外部点击多一次跳转). 页面和其他场景继续回退到当前 head.url.
     */
    const shareUrl = computed(() => {
        if (detailType.value === PostDetailType.Post && postId.value) {
            return new URL(`/p/${postId.value}`, window.location.origin).toString()
        }

        return head.value.url || window.location.href
    })

    const handleClickInteraction = (val: InteractionIcon) => {
        if (!isLogin.value && (val === "like" || val === "star")) {
            MessageUtil.warning("【点赞】和【收藏】 需要登录")
            return
        }

        switch (val) {
            case "like":
                setPostLike({ post_id: postId.value, like: !postMeta.value.interactionStatus?.is_like })
                break
            case "star":
                setPostStar({ post_id: postId.value, star: !postMeta.value.interactionStatus?.is_star })
                break
            case "share":
                MessageUtil.success("海报正在生成中, 请稍等...")
                isShowPosterShare.value = true
                break
            case "link":
                if (!shareUrl.value || shareUrl.value === "") {
                    MessageUtil.warning("链接不存在")
                    return
                }
                // 构造需要复制的 text
                const text = `${shareUrl.value}`
                copyText(text)
                    .then(() => {
                        MessageUtil.success("复制成功")
                    })
                    .catch(() => {
                        MessageUtil.error("复制失败")
                    })
                break
        }
    }

    // 设置交互项的左侧偏移量, 保障不同屏幕下偏移量一致
    const setAffixLeft = () => {
        if (postDetailRef.value) {
            const left = postDetailRef.value.offsetLeft
            // 如果 left 值小于 0, 则设置为 -100, 即隐藏
            const affix = left - 50 > 0 ? left - 50 : -100
            postDetailRef.value.style.setProperty("--affix-left", `${affix}px`)
        }
    }

    watch(
        () => windowWidth.value,
        () => {
            setAffixLeft()
        },
    )

    return {
        interactionItems, // 交互项
        isShowPosterShare, // 是否显示分享海报
        handPosterComplete, // 处理分享海报完成事件
        dataPosterShare, // 生成分享海报需要的数据
        handleClickInteraction, // 处理交互点击事件
        setAffixLeft, // 设置交互项的左侧偏移量
    }
}
