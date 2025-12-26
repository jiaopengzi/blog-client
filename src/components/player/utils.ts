/**
 * @FilePath     : \blog-client\src\components\player\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 视频组件工具方法
 */

import { ResponseCode } from "@/api/response"
import { getSubtitlesAPI, type Subtitles as SubtitlesRes } from "@/api/video/getSubtitles"

import type { LanguageKey, LogoWatermark, PlayerState, Subtitles, SubtitlesItem, TextWatermark } from "./types"
import { Language, MediaTypes, PlaybackRate, PlayLevelLabel, PlayStatus } from "./types"

/**
 * 创建默认播放器属性。
 *
 * @returns {PlayerState} - 返回默认播放器属性。
 */
export const createDefaultPlayerState = (): PlayerState => ({
    timerId: null,
    mediaType: MediaTypes.HLS,
    videoID: "",
    src: "",
    poster: "",
    playStatus: PlayStatus.STOPPED,
    playProgress: { currentTime: 0, duration: 2004, isDragging: false },
    isWebFullScreen: false,
    isFullScreen: false,
    playLevel: {
        level: PlayLevelLabel.FULL_HD_1080P,
        allLevels: {},
    },
    playbackRate: PlaybackRate.NORMAL,
    volume: {
        volume: 50, // 默认音量
        muted: false, // 是否静音
        lastVolume: 50, // 上次音量
    }, // 默认音量
    showControlBar: true,
    useVideoControls: false,
    isPictureInPicture: false,
    size: { width: 720, height: 405 },
    isMobile: false,
    isLoop: false,
    textWatermark: {
        content: "jiaopengzi.com",
        style: {
            color: "red",
            fontSize: "12px",
        },
    },
    logoWatermark: {
        imgUrl: "",
        style: {
            height: "32px",
            top: "16px",
            right: "24px",
        },
    },
    autoPlay: false,
    isUserInput: false,
    subtitles: {
        selectedSubtitlesLanguage: "disabled",
    },
    localVideoSubtitlesURLs: [],
    isIphone: false,
    isShortcutKey: false,
    showError: false,
    errMsg: "",
    isAdmin: false,
    hasToc: false,
    isShowToc: false,
    postId: "",
})

/**
 * 根据视频的哈希 ID 创建字幕对象。
 *
 * @param {string} videoHashId - 视频的哈希 ID。
 * @returns {Subtitles} - 返回字幕对象。
 */
export const createSubtitlesByVideoHashId = async (videoHashId: string | null | undefined | "", playerState: PlayerState): Promise<Subtitles> => {
    // 如果没有指定哈希 ID，则返回空字幕对象
    if (!videoHashId) return {}

    // 初始化字幕对象
    let subtitlesRes: SubtitlesRes = {}

    // 获取字幕语言信息
    await getSubtitlesAPI(videoHashId).then((response) => {
        // 如果请求失败，则返回空字幕对象
        if (response.data.code !== ResponseCode.GetVideoSubtitlesSuccess) return {}

        // 如果没有字幕数据，则返回空字幕对象
        if (!response.data.data) return {}

        // 保存字幕数据
        subtitlesRes = response.data.data
    })

    // 初始化 availableSubtitles
    const subtitles: Subtitles = {
        availableSubtitles: {},
        selectedSubtitlesLanguage: "disabled",
    }

    // 获取字幕语言列表
    const languages = Object.keys(subtitlesRes) as Array<LanguageKey>

    // 遍历字幕语言列表构造字幕对象
    for (const subtitlesLanguage of languages) {
        // 构造本地 URL
        const subtitlesBlob = new Blob([subtitlesRes[subtitlesLanguage]!.subtitles], {
            type: "text/vtt",
        })

        // 创建 URL
        const subtitlesURL = URL.createObjectURL(subtitlesBlob)
        playerState.localVideoSubtitlesURLs.push(subtitlesURL) // 保存 URL 引用

        // 构造字幕项
        const item: SubtitlesItem = {
            label: Language[subtitlesLanguage as LanguageKey], // 字幕标签，例如 'English', '中文' 等
            src: subtitlesURL, // 字幕文件的URL
        }

        // 将字幕项添加到 availableSubtitles 中
        subtitles.availableSubtitles![subtitlesLanguage as LanguageKey] = item
    }

    return subtitles
}

/**
 * @description: 根据视频高度获取视频质量标签,高度小于最小值时，返回最小值，大于最大值时，返回最大值，否则返回小于等于当前高度的最大值.
 * @param height 视频高度
 * @return  返回视频质量标签
 */
export const getVideoQualityLabel = (height: number): string => {
    // 视频质量标签
    const VideoQualityLabels: Record<number, string> = {
        4320: PlayLevelLabel.ULTRA_HD_8K,
        2160: PlayLevelLabel.ULTRA_HD_4K,
        1440: PlayLevelLabel.QHD_2K,
        1080: PlayLevelLabel.FULL_HD_1080P,
        720: PlayLevelLabel.HD_720P,
        480: PlayLevelLabel.SD_480P,
        360: PlayLevelLabel.LD_360P,
        240: PlayLevelLabel.LOW_240P,
    }
    // 降序排列
    const heights = Object.keys(VideoQualityLabels)
        .map(Number)
        .sort((a, b) => a - b)
    // 高度小于最小值时，返回最小值，大于最大值时，返回最大值，否则返回小于等于当前高度的最大值
    let closest = heights[0]

    for (const h of heights) {
        if (h - height >= 0) {
            closest = h
            return VideoQualityLabels[closest]!
        }
    }
    return VideoQualityLabels[closest!]!
}

/**
 * @description: 默认图片水印配置
 * @param imgUrl 图片地址
 * @return  返回图片水印对象
 */
export const defaultLogoWatermark = (
    imgUrl: string,
    style: Partial<CSSStyleDeclaration> = {
        height: "32px",
        top: "16px",
        right: "24px",
    },
): LogoWatermark => {
    const logoWatermark: LogoWatermark = {
        imgUrl: imgUrl,
        style,
    }

    return logoWatermark
}

/**
 * @description: 默认文字水印配置
 * @param text 文字内容
 * @return  返回文字水印对象
 */
export const defaultTextWatermark = (
    text: string,
    style: Partial<CSSStyleDeclaration> = {
        color: "red",
        fontSize: "12px",
    },
): TextWatermark => {
    const textWatermark: TextWatermark = {
        content: text,
        style,
    }

    return textWatermark
}
