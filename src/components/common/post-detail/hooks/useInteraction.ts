/*
 * FilePath    : blog-client\src\components\common\post-detail\hooks\useInteraction.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 交互相关的hook
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

    // 初始状态
    const interactionItems: ComputedRef<InteractionItemProps[]> = computed(() => {
        const result = [
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

        // 判断是否为全部都不显示, statusStore 中设置为false
        if (result.every((item) => !item.isShow)) {
            statusStore.setShowDetailInteraction(false)
        }

        return result.filter((item) => item.isShow)
    })

    const isShowPosterShare = ref(false) // 是否显示分享海报

    // 处理分享海报完成事件
    const handPosterComplete = () => {
        isShowPosterShare.value = false // 关闭分享海报
    }

    // 生成分享海报需要的数据
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
     * 文章详情优先使用 `/post/:postId`, 避免复制内部查询串 `/?post_id=...` 导致外部打开时不稳定.
     * 页面和其他场景继续回退到当前 head.url.
     */
    const shareUrl = computed(() => {
        if (detailType.value === PostDetailType.Post && postId.value) {
            return new URL(`/post/${postId.value}`, window.location.origin).toString()
        }

        return head.value.url || window.location.href
    })

    // 处理交互点击事件
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
                isShowPosterShare.value = true // 显示分享海报
                break
            case "link":
                if (!shareUrl.value || shareUrl.value === "") {
                    MessageUtil.warning("链接不存在")
                    return
                }
                // 构造需要复制的text
                // const text = `[${head.value.title}](${shareUrl.value})`
                const text = `${shareUrl.value}`
                // 复制链接到剪贴板
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

    // 设置交互项的左侧偏移量, 保障在不同屏幕下, 交互项的左侧偏移量一致
    const setAffixLeft = () => {
        if (postDetailRef.value) {
            const left = postDetailRef.value.offsetLeft // 获取当前元素的 left 值
            const affix = left - 50 > 0 ? left - 50 : -100 // 如果 left 值小于0, 则设置为-100,即隐藏
            postDetailRef.value.style.setProperty("--affix-left", `${affix}px`)
        }
    }

    // 宽度变化时
    watch(
        () => windowWidth.value,
        () => {
            setAffixLeft() // 设置左侧偏移量
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
