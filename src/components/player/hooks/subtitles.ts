/**
 * FilePath    : blog-client-dev\src\components\player\hooks\subtitles.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 字幕
 */

import { computed, type Reactive } from "vue"

import { DisabledSubtitles, type LanguageKey, type PlayerState } from "../types"

// 字幕 hook
export function useSubtitles(localPlayerState: Reactive<PlayerState>) {
    // 是否显示字幕选择
    const isShowSubtitles = computed(() => {
        if (localPlayerState.subtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
            // 判断 subtitles.value.selectedSubtitlesLanguage 是否在 DisabledSubtitles keys 中, 如果在则不显示字幕, 否则显示字幕
            return !Object.keys(DisabledSubtitles).includes(localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey)
        }
        return false
    })

    // 字幕 src
    const subtitlesSrc = computed(() => {
        if (localPlayerState.subtitles && localPlayerState.subtitles.availableSubtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
            const availableSubtitles = {
                ...DisabledSubtitles, // 确保不会出现 undefined
                ...localPlayerState.subtitles.availableSubtitles,
            }
            const selectedSubtitle = availableSubtitles[localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey]
            return selectedSubtitle ? selectedSubtitle.src : ""
        }
        return ""
    })

    // 字幕语言
    const srclang = computed(() => {
        if (localPlayerState.subtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
            return localPlayerState.subtitles.selectedSubtitlesLanguage
        }
        return ""
    })

    // 字幕 label
    const subtitlesLabel = computed(() => {
        if (localPlayerState.subtitles && localPlayerState.subtitles.availableSubtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
            const availableSubtitles = {
                ...DisabledSubtitles,
                ...localPlayerState.subtitles.availableSubtitles,
            }
            const selectedSubtitle = availableSubtitles[localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey]
            return selectedSubtitle ? selectedSubtitle.label : ""
        }
        return ""
    })

    return {
        isShowSubtitles,
        subtitlesSrc,
        srclang,
        subtitlesLabel,
    }
}
