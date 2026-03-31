/**
 * FilePath    : blog-client\src\components\hooks\useVideoWatermark\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频水印 hooks
 */

import { storeToRefs } from "pinia"
import { computed, type ComputedRef, watch } from "vue"

import { defaultLogoWatermark, defaultTextWatermark, type LogoWatermark, PlayerStateManager, type TextWatermark } from "@/components/player"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"

// 视频水印 hooks
export function useVideoWatermark(manager: PlayerStateManager) {
    const optionsStore = useOptionsStore()
    const userStore = useUserStore()

    const { video_watermark } = storeToRefs(optionsStore)
    const { data } = storeToRefs(userStore)

    // 文字水印
    const textWatermark: ComputedRef<TextWatermark> = computed(() => {
        // 如果没有开启文字水印，返回空内容
        if (!video_watermark.value.text_enable) {
            return defaultTextWatermark("")
        }

        const content = data.value.user.user_name || video_watermark.value.text_default || ""
        const style = video_watermark.value.text_style

        if (!style) {
            return defaultTextWatermark(content)
        }

        return { content, style }
    })

    // logo 水印
    const logoWatermark: ComputedRef<LogoWatermark> = computed(() => {
        // 如果没有开启 logo 水印，返回空 url
        if (!video_watermark.value.logo_enable) {
            return defaultLogoWatermark("")
        }

        const imgUrl = video_watermark.value.logo_url || ""
        const style = video_watermark.value.logo_style

        if (!style) {
            return defaultLogoWatermark(imgUrl)
        }
        return { imgUrl, style }
    })

    // 监听文字水印变化
    watch(
        textWatermark,
        (newVal) => {
            manager.setTextWatermark(newVal)
        },
        { immediate: true },
    )

    // 监听 logo 水印变化
    watch(
        logoWatermark,
        (newVal) => {
            manager.setLogoWatermark(newVal)
        },
        { immediate: true },
    )
}
