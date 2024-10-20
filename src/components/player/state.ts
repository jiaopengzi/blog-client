/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-18 16:21:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-20 11:10:35
 * @FilePath     : \blog-client\src\components\player\state.ts
 * @Description  : 视频组件状态管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import type {
    PlayerState,
    PlayLevelLabel,
    PlaybackRate,
    PlayProgress,
    Subtitles,
    MediaTypes,
    SubtitlesItem,
    LanguageKey,
    TextWatermark,
    LogoWatermark,
} from "./types"

import { PlayStatus } from "./types"
import { createDefaultPlayerState, createSubtitlesByVideoHashId } from "./utils"
import { reactive } from "vue"

/**
 * @description: 播放器 props 类
 */
export class PlayerStateManager {
    private state: PlayerState

    // 初始化为默认状态
    constructor(initialState: PlayerState = createDefaultPlayerState()) {
        this.state = reactive(initialState) // 响应式对象
    }

    // 获取当前播放状态是否为播放中
    get isPlaying() {
        return this.state.playStatus === PlayStatus.PLAYING
    }

    // 获取当前播放状态是否为暂停
    get isPaused() {
        return this.state.playStatus === PlayStatus.PAUSED
    }

    // 获取当前播放状态是否为停止
    get isStopped() {
        return this.state.playStatus === PlayStatus.STOPPED
    }

    // 获取当前播放状态是否为缓冲中
    get isBuffering() {
        return this.state.playStatus === PlayStatus.BUFFERING
    }

    // 设置媒体类型
    setMediaType(mediaType: MediaTypes): void {
        this.state.mediaType = mediaType
    }

    // 设置视频源
    setSrc(src: string): void {
        this.state.src = src
    }

    // 设置封面图
    setPoster(poster: string): void {
        this.state.poster = poster
    }

    // 设置音量
    setVolume(newVolume: number): void {
        this.state.volume.lastVolume = this.state.volume.volume
        if (newVolume <= 0) {
            this.state.volume.volume = 0
            this.state.volume.muted = true
        } else if (newVolume > 100) {
            this.state.volume.volume = 100
            this.state.volume.muted = false
        } else {
            this.state.volume.volume = newVolume
            this.state.volume.muted = false
        }
    }

    // 切换静音
    toggleMute(): void {
        this.state.volume.muted = !this.state.volume.muted
        if (this.state.volume.muted) {
            this.state.volume.lastVolume = this.state.volume.volume
            this.state.volume.volume = 0
        } else {
            this.state.volume.volume = this.state.volume.lastVolume || 20
        }
    }

    // 播放
    play(): void {
        this.state.playStatus = PlayStatus.PLAYING
    }

    // 暂停
    pause(): void {
        this.state.playStatus = PlayStatus.PAUSED
    }

    // 停止
    stop(): void {
        this.state.playStatus = PlayStatus.STOPPED
    }

    // 缓冲中
    buffering(): void {
        this.state.playStatus = PlayStatus.BUFFERING
    }

    // 播放结束
    end(): void {
        this.state.playStatus = PlayStatus.ENDED
    }

    // 切换播放/暂停
    togglePlayPause(): void {
        if (this.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    // 设置播放进度
    setPlayProgress(playProgress: PlayProgress): void {
        this.state.playProgress = playProgress
    }

    // 设置当前时间
    setCurrentTime(currentTime: number): void {
        this.state.playProgress.currentTime = currentTime
    }

    // 设置持续时间
    setDuration(duration: number): void {
        this.state.playProgress.duration = duration
    }

    // 设置缓冲时间
    setBuffered(buffered: number): void {
        this.state.playProgress.buffered = buffered
    }

    // 设置是否正在拖动
    setIsDragging(isDragging: boolean): void {
        this.state.playProgress.isDragging = isDragging
    }

    // 快进
    fastForward(): void {
        if (this.state.playProgress.currentTime + 10 >= this.state.playProgress.duration) {
            this.state.playProgress.currentTime = this.state.playProgress.duration
            return
        }
        this.state.playProgress.currentTime += 10
    }

    // 快退
    rewind(): void {
        if (this.state.playProgress.currentTime - 10 <= 0) {
            this.state.playProgress.currentTime = 0
            return
        }
        this.state.playProgress.currentTime -= 10
    }

    // 切换全屏
    toggleFullScreen(): void {
        this.state.isFullScreen = !this.state.isFullScreen
        if (this.state.isFullScreen) {
            this.state.isWebFullScreen = false
        }
    }

    // 设置是否全屏
    setIsFullScreen(isFullScreen: boolean): void {
        this.state.isFullScreen = isFullScreen
    }

    // 切换网页全屏
    toggleWebFullScreen(): void {
        this.state.isWebFullScreen = !this.state.isWebFullScreen
        if (this.state.isWebFullScreen) {
            this.state.isFullScreen = false
        }
    }

    // 设置是否网页全屏
    setIsWebFullScreen(isWebFullScreen: boolean): void {
        this.state.isWebFullScreen = isWebFullScreen
    }

    // 退出全屏
    exitFullScreen(): void {
        this.state.isFullScreen = false
        this.state.isWebFullScreen = false
    }

    // 设置选择的播放质量
    setSelectedPlayLevel(level: PlayLevelLabel): void {
        this.state.playLevel.level = level
    }

    // 设置所有播放质量
    setPlayLevelAllLevels(allLevels: Record<string, number>): void {
        this.state.playLevel.allLevels = allLevels
    }

    // 设置播放速率
    setPlaybackRate(playbackRate: PlaybackRate): void {
        this.state.playbackRate = playbackRate
    }

    // 切换控制栏
    toggleControlBar(): void {
        this.state.showControlBar = !this.state.showControlBar
    }

    // 切换视频控件
    toggleVideoControls(): void {
        this.state.useVideoControls = !this.state.useVideoControls
    }

    // 设置播放器大小
    setSize(width: number, height: number): void {
        this.state.size = { width, height }
    }

    // 设置选择的字幕语言
    setSelectedSubtitlesLanguage(language: LanguageKey): void {
        this.state.subtitles.selectedSubtitlesLanguage = language
    }

    // 设置可用字幕
    setAvailableSubtitles(availableSubtitles: Partial<Record<LanguageKey, SubtitlesItem>>): void {
        this.state.subtitles.availableSubtitles = availableSubtitles
    }

    // 设置字幕
    setSubtitles(subtitles: Subtitles): void {
        this.state.subtitles = subtitles
    }

    // 根据视频 hash ID 自动设置字幕
    setSubtitlesByVideoHashIdAuto(): void {
        if (!this.state.src) return
        // 根据视频 hash ID 和字幕语言列表创建字幕对象
        createSubtitlesByVideoHashId(this.state.src, this.state).then((subtitles) => {
            this.setSubtitles(subtitles) // 设置字幕
        })
    }

    // 切换画中画
    togglePictureInPicture(): void {
        this.state.isPictureInPicture = !this.state.isPictureInPicture
    }

    // 设置是否移动设备
    setIsMobile(isMobile: boolean): void {
        this.state.isMobile = isMobile
    }

    // 设置文本水印
    setTextWatermark(textWatermark: TextWatermark): void {
        this.state.textWatermark = textWatermark
    }

    // 设置 logo 水印
    setLogoWatermark(logoWatermark: LogoWatermark): void {
        this.state.logoWatermark = logoWatermark
    }

    // 切换循环播放
    toggleLoop(): void {
        this.state.isLoop = !this.state.isLoop
    }

    // 切换自动播放
    toggleAutoPlay(): void {
        this.state.autoPlay = !this.state.autoPlay
    }

    // 设置用户输入
    setUserInput(flag: boolean): void {
        this.state.isUserInput = flag
    }

    // 设置是否为 iPhone
    setIsIphone(isIphone: boolean): void {
        this.state.isIphone = isIphone
    }

    // 切换是否使用快捷键
    toggleShortcutKey(): void {
        this.state.isShortcutKey = !this.state.isShortcutKey
    }

    // 设置是否使用快捷键
    setShortcutKey(isShortcutKey: boolean): void {
        this.state.isShortcutKey = isShortcutKey
    }

    // 清除所有创建的本地视频字幕 URL,避免内存泄漏
    clearLocalVideoSubtitlesURLs(): void {
        if (this.state.localVideoSubtitlesURLs && this.state.localVideoSubtitlesURLs.length > 0) {
            this.state.localVideoSubtitlesURLs.forEach((url) => URL.revokeObjectURL(url))
            this.state.localVideoSubtitlesURLs.length = 0
        }
    }

    // 销毁,恢复默认状态
    destroy(): void {
        this.clearLocalVideoSubtitlesURLs()
        this.state = createDefaultPlayerState()
    }

    // 获取播放器状态
    getState(): PlayerState {
        return this.state
    }

    // 更新状态
    updateState(state: PlayerState): void {
        this.state = state
    }
}
