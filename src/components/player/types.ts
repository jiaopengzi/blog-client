/*
 * FilePath    : blog-client-nuxt\src\components\player\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频组件类型定义
 */

// 媒体类型
export enum MediaTypes {
    HLS = "hls",
    MP4 = "mp4",
    WEBM = "webm",
}

// 播放状态
export enum PlayStatus {
    PLAYING = "playing",
    PAUSED = "paused",
    STOPPED = "stopped",
    BUFFERING = "buffering",
    ENDED = "ended",
    ERROR = "error",
}

// 播放质量
export enum PlayLevelLabel {
    ULTRA_HD_8K = "8k",
    ULTRA_HD_4K = "4k",
    QHD_2K = "2k",
    FULL_HD_1080P = "1080p",
    HD_720P = "720p",
    SD_480P = "480p",
    LD_360P = "360p",
    LOW_240P = "240p",
}

// 播放速度
export enum PlaybackRate {
    VERY_SLOW = 0.25,
    SLOW = 0.5,
    MEDIUM_SLOW = 0.75,
    NORMAL = 1,
    MEDIUM_FAST = 1.25,
    FAST = 1.5,
    FASTER = 2,
}

export interface PlayLevel {
    level: PlayLevelLabel
    allLevels: Record<string, number>
}

export interface Volume {
    volume: number
    muted: boolean
    lastVolume: number // 静音前的音量
}

// 播放进度
export interface PlayProgress {
    currentTime: number // 当前播放时间 (以秒为单位)
    duration: number // 总时长 (以秒为单位)
    buffered?: number // 缓冲进度 (以秒为单位)
    isDragging: boolean // 是否正在拖拽进度条
}

// 常用的语言及显示名称 enum
export enum Language {
    "zh-CN" = "简体中文",
    "zh-TW" = "繁體中文",
    "en-US" = "English(US)",
    "en-GB" = "English(UK)",
    "fr-FR" = "Français",
    "de-DE" = "Deutsch",
    "es-ES" = "Español",
    "it-IT" = "Italiano",
    "ja-JP" = "日本語",
    "ko-KR" = "한국어",
    "ru-RU" = "Русский",
    "pt-PT" = "Português",
    "pt-BR" = "Português(BR)",
    "nl-NL" = "Nederlands",
    "sv-SE" = "Svenska",
    "da-DK" = "Dansk",
    "fi-FI" = "Suomi",
    "no-NO" = "Norsk",
    "pl-PL" = "Polski",
    "tr-TR" = "Türkçe",
    "cs-CZ" = "Čeština",
    "hu-HU" = "Magyar",
    "el-GR" = "Ελληνικά",
    "he-IL" = "עברית",
    "ar-SA" = "العربية",
    "th-TH" = "ไทย",
    "vi-VN" = "Tiếng Việt",
    "id-ID" = "Bahasa Indonesia",
    disabled = "禁用",
}

// 语言约束类型
export type LanguageKey = keyof typeof Language

// 字幕
export interface SubtitlesItem {
    label: string // 字幕标签, 例如 'English', '中文', 'Español' 等
    src: string // 字幕文件的 URL
}

// 定义 disabled 字幕
export const DisabledSubtitles: Partial<Record<LanguageKey, SubtitlesItem>> = {
    disabled: {
        label: Language.disabled,
        src: "",
    },
}

// 字幕状态
export interface Subtitles {
    availableSubtitles?: Partial<Record<LanguageKey, SubtitlesItem>> // 可用字幕列表, 字幕语言例如 'en', 'zh', 'es' 等
    selectedSubtitlesLanguage?: LanguageKey // 当前选择的字幕语言 key, 默认值 disabled
}

// 位置
export interface Position {
    x: number | string // 水平位置, 可以是像素值 (例如 100) 或百分比字符串 (例如 '50%')
    y: number | string // 垂直位置, 可以是像素值 (例如 100) 或百分比字符串 (例如 '50%')
}

// 文字水印
export interface TextWatermark {
    content: string // 水印内容, 例如 'Sample Watermark'
    style?: Partial<CSSStyleDeclaration>
}

// logo 水印
export interface LogoWatermark {
    imgUrl: string // logo 的 URL 地址
    style?: Partial<CSSStyleDeclaration>
}

// 播放器尺寸
export interface PlayerSize {
    width: number // 播放器宽度 (像素)
    height: number // 播放器高度 (像素)
}

export interface PlayerState {
    timerId: number | null
    mediaType: MediaTypes
    videoID: string
    src: string
    poster: string
    playStatus: PlayStatus
    playProgress: PlayProgress
    isWebFullScreen: boolean
    isFullScreen: boolean
    playLevel: PlayLevel
    playbackRate: PlaybackRate
    volume: Volume
    showControlBar: boolean
    useVideoControls: boolean
    size: PlayerSize
    subtitles: Subtitles
    localVideoSubtitlesURLs: string[]
    isPictureInPicture: boolean
    isMobile: boolean
    textWatermark: TextWatermark
    logoWatermark: LogoWatermark
    isLoop: boolean
    autoPlay: boolean
    isUserInput: boolean
    isIphone: boolean
    isShortcutKey: boolean
    showError: boolean
    errMsg: string
    isAdmin: boolean
    hasToc: boolean
    isShowToc: boolean
    postId: string // 视频所属的文章 ID
}
