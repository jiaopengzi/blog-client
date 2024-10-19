/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-18 16:02:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-19 09:08:32
 * @FilePath     : \blog-client\src\components\player\types.ts
 * @Description  : 视频组件类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 播放状态
export enum MediaTypes {
    HLS = "hls",
    MP4 = "mp4",
    WEBM = "webm",
    // DASH = 'dash',
    // OGG = 'ogg',
    // YOUTUBE = 'youtube',
    // BILIBILI = 'bilibili',
}

// 播放状态
export enum PlayStatus {
    PLAYING = "playing", // 播放中
    PAUSED = "paused", // 暂停
    STOPPED = "stopped", // 停止
    BUFFERING = "buffering", // 缓冲中
    ENDED = "ended", // 播放结束
    ERROR = "error", // 播放错误
}

// 播放质量
export enum PlayLevelLabel {
    ULTRA_HD_8K = "8k", // 8K 超高清
    ULTRA_HD_4K = "4k", // 4K 超高清
    QHD_2K = "2k", // 2K QHD
    FULL_HD_1080P = "1080p", // 1080p 全高清
    HD_720P = "720p", // 720p 高清
    SD_480P = "480p", // 480p 标清
    LD_360P = "360p", // 360p 低清
    LOW_240P = "240p", // 240p 超低清
}

// 播放速度
export enum PlaybackRate {
    VERY_SLOW = 0.25,
    SLOW = 0.5,
    MEDIUM_SLOW = 0.75,
    NORMAL = 1,
    FAST = 1.5,
    FASTER = 2,
    VERY_FAST = 4,
}

export interface PlayLevel {
    level: PlayLevelLabel // 播放质量
    allLevels: Record<string, number> // 所有可用的播放质量
}

export interface Volume {
    volume: number // 音量
    muted: boolean // 是否静音
    lastVolume: number // 静音前的音量
}

// 播放进度
export interface PlayProgress {
    currentTime: number // 当前播放时间（以秒为单位）
    duration: number // 总时长（以秒为单位）
    buffered?: number // 缓冲进度（以秒为单位）
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
    "disabled" = "禁用",
}

// 语言约束类型
export type LanguageKey = keyof typeof Language

// 字幕
export interface SubtitlesItem {
    label: string // 字幕标签，例如 'English', '中文', 'Español' 等
    src: string // 字幕文件的URL
}

// 定义 disabled 字幕
// export const DisabledSubtitles: { [language: string]: SubtitlesItem } = {
export const DisabledSubtitles: Partial<Record<LanguageKey, SubtitlesItem>> = {
    disabled: {
        label: Language.disabled,
        src: "",
    },
}

// 字幕状态
export interface Subtitles {
    availableSubtitles?: Partial<Record<LanguageKey, SubtitlesItem>> // 可用字幕列表,字幕语言，例如 'en', 'zh', 'es' 等
    selectedSubtitlesLanguage?: LanguageKey // 当前选择的字幕的语言 key 默认值 disabled
}

// 位置
export interface Position {
    x: number | string // 水平位置，可以是像素值（例如 100）或百分比字符串（例如 '50%'）
    y: number | string // 垂直位置，可以是像素值（例如 100）或百分比字符串（例如 '50%'）
}

// 文字水印
export interface TextWatermark {
    content: string // 水印内容，例如 'Sample Watermark'
    style?: Partial<CSSStyleDeclaration> // 水印样式
}

// logo 水印
export interface LogoWatermark {
    imgUrl: string // logo 的 URL 地址
    style?: Partial<CSSStyleDeclaration> // logo 的样式
}

// 播放器尺寸
export interface PlayerSize {
    width: number // 播放器宽度（像素）
    height: number // 播放器高度（像素）
}

export interface PlayerState {
    // 媒体类型
    mediaType: MediaTypes
    // 视频地址
    src: string
    // 海报
    poster: string
    // 播放状态
    playStatus: PlayStatus
    // 播放进度
    playProgress: PlayProgress
    // 网页全屏状态
    isWebFullScreen: boolean
    // 全屏状态
    isFullScreen: boolean
    // 播放质量
    playLevel: PlayLevel
    // 播放速度
    playbackRate: PlaybackRate
    // 音量
    volume: Volume
    // 是否显示控制栏
    showControlBar: boolean
    // 使用 video 默认 controls
    useVideoControls: boolean
    // 播放器尺寸
    size: PlayerSize
    // 字幕
    subtitles: Subtitles
    // 本地视频字幕 URL
    localVideoSubtitlesURLs: string[]
    // 画中画
    isPictureInPicture: boolean
    // 是否为移动端
    isMobile: boolean
    // 水印
    textWatermark: TextWatermark
    logoWatermark: LogoWatermark
    // 是否循环播放
    isLoop: boolean
    // 是否自动播放
    autoPlay: boolean
    // 是否用户输入
    isUserInput: boolean
    // 是否为 iphone
    isIphone: boolean
    // 是否开启快捷键
    isShortcutKey: boolean
}
