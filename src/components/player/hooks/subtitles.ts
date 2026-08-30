/*
 * FilePath    : blog-client-nuxt\src\components\player\hooks\subtitles.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 字幕
 */

import { computed, type CSSProperties, type Reactive } from "vue"

import { DisabledSubtitles, type LanguageKey, type PlayerState } from "../types"

/**
 * 判断文本轨道 cue 是否为支持 WebVTT 布局属性的 cue.
 * @param cue 文本轨道中的 cue.
 * @returns cue 是否支持 WebVTT 布局属性.
 */
function isWebVttCue(cue: TextTrackCue): cue is VTTCue {
    return "line" in cue && "position" in cue && "align" in cue && "snapToLines" in cue
}

/**
 * 为未声明布局的 WebVTT cue 应用播放器默认设置, 已有任意自定义布局的 cue 保持不变.
 * @param textTrack 已加载完成的字幕文本轨道.
 * @returns 无返回值.
 */
export function applyDefaultSubtitleCueSettings(textTrack: TextTrack): void {
    if (!textTrack.cues) return

    for (const cue of Array.from(textTrack.cues)) {
        if (!isWebVttCue(cue)) continue

        const hasCustomSettings = cue.line !== "auto" || cue.position !== "auto" || cue.align !== "center"
        if (hasCustomSettings) continue

        cue.snapToLines = false
        cue.line = 88
        cue.position = 50
        cue.align = "center"
    }
}

/**
 * 根据 WebVTT cue 设置生成覆盖层位置, 保留用户的定位, 对齐和书写方向.
 * Chromium 可能不提供 lineAlign 和 positionAlign, 此时分别按中心锚点和 auto 处理.
 * @param cue 当前需要渲染的 WebVTT cue.
 * @returns 可直接绑定到字幕元素的定位样式.
 */
export function getSubtitleCueStyle(cue: VTTCue): CSSProperties {
    const position = typeof cue.position === "number" ? cue.position : 50
    const line = typeof cue.line === "number" && !cue.snapToLines ? cue.line : 88
    const positionAlign = cue.positionAlign || "auto"
    const resolvedPositionAlign = positionAlign === "auto" ? cue.align : positionAlign
    const translateX =
        resolvedPositionAlign === "line-left" || resolvedPositionAlign === "left" || resolvedPositionAlign === "start"
            ? 0
            : resolvedPositionAlign === "line-right" || resolvedPositionAlign === "right" || resolvedPositionAlign === "end"
              ? -100
              : -50
    const lineAlign = cue.lineAlign || "center"
    const translateY = lineAlign === "start" ? 0 : lineAlign === "end" ? -100 : -50

    return {
        left: `${position}%`,
        top: `${line}%`,
        maxWidth: `${cue.size}%`,
        textAlign: cue.align,
        transform: `translate(${translateX}%, ${translateY}%)`,
        writingMode: cue.vertical === "rl" ? "vertical-rl" : cue.vertical === "lr" ? "vertical-lr" : "horizontal-tb",
    }
}

export function useSubtitles(localPlayerState: Reactive<PlayerState>) {
    const isShowSubtitles = computed(() => {
        if (localPlayerState.subtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
            // 选中语言在 DisabledSubtitles 中则不显示字幕, 否则显示字幕
            return !Object.keys(DisabledSubtitles).includes(localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey)
        }
        return false
    })

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

    const srclang = computed(() => {
        if (localPlayerState.subtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
            return localPlayerState.subtitles.selectedSubtitlesLanguage
        }
        return ""
    })

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
