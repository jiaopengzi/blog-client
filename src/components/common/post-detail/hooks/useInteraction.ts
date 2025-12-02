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
import { copyText } from "@/utils/clipboard"
import { MessageUtil } from "@/utils/message"

import { type InteractionIcon, type InteractionItemProps } from "../components/interaction"

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
    setPostLike: (req: PostLikeRequest) => Promise<void>,
    setPostStar: (req: PostStarRequest) => Promise<void>,
    postDetailRef: Ref<HTMLElement | null>,
) {
    const userStore = useUserStore()
    const optionsStore = useOptionsStore()
    const deviceStore = useDeviceStore()

    const { windowWidth } = storeToRefs(deviceStore)
    const { head, app_options } = storeToRefs(optionsStore)

    const { isLogin } = storeToRefs(userStore)

    // 初始状态
    const interactionItems: ComputedRef<InteractionItemProps[]> = computed(() => {
        return [
            {
                icon: "like",
                text: "点赞",
                isActive: postMeta.value.interactionStatus?.is_like,
                tip: postMeta.value.like_count,
            },
            {
                icon: "star",
                text: "收藏",
                isActive: postMeta.value.interactionStatus?.is_star,
                tip: postMeta.value.star_count,
            },
            {
                icon: "share",
                text: "分享",
            },
            {
                icon: "link",
                text: "复制链接",
            },
        ]
    })

    const isShowPosterShare = ref(false) // 是否显示分享海报

    // 处理分享海报完成事件
    const handPosterComplete = () => {
        isShowPosterShare.value = false // 关闭分享海报
    }

    // 生成分享海报需要的数据
    const dataPosterShare = computed(() => {
        return {
            logoSrc: app_options.value.favicon.value,
            imgSrc: head.value.image,
            titleText: postMeta.value.post_title,
            urlText: head.value.url,
        }
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
                if (!head.value.url || head.value.url === "") {
                    MessageUtil.warning("链接不存在")
                    return
                }
                // 构造需要复制的text
                const text = `[${head.value.title}](${head.value.url})`
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
