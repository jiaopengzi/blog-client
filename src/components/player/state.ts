/**
 * @FilePath     : \blog-client\src\components\player\state.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 视频组件状态管理
 */

import { reactive } from "vue"

import type {
    LanguageKey,
    LogoWatermark,
    MediaTypes,
    PlaybackRate,
    PlayerState,
    PlayLevelLabel,
    PlayProgress,
    Subtitles,
    SubtitlesItem,
    TextWatermark,
} from "./types"
import { PlayStatus } from "./types"
import { createDefaultPlayerState, createSubtitlesByVideoHashId } from "./utils"

/**
 * @description: 播放器状态管理类
 * @class PlayerStateManager
 * @example
 * const manager = new PlayerStateManager()
 * const state = manager.getState()
 */
export class PlayerStateManager {
    /**
     * 播放器状态
     * @private {PlayerState}
     */
    private state: PlayerState

    /**
     * 创建播放器状态管理器实例
     * @constructor
     * @param {PlayerState} [initialState] - 初始播放器状态，默认为默认状态
     */
    constructor(initialState: PlayerState = createDefaultPlayerState()) {
        this.state = reactive(initialState) // 响应式对象
    }

    /**
     * 获取当前播放状态是否为播放中
     * @returns {boolean} 如果当前播放状态为播放中，则返回 true，否则返回 false
     */
    get isPlaying(): boolean {
        return this.state.playStatus === PlayStatus.PLAYING
    }

    /**
     * 获取当前播放状态是否为暂停
     * @returns {boolean} 如果当前播放状态为暂停，则返回 true，否则返回 false
     */
    get isPaused(): boolean {
        return this.state.playStatus === PlayStatus.PAUSED
    }

    /**
     * 获取当前播放状态是否为停止
     * @returns {boolean} 如果当前播放状态为停止，则返回 true，否则返回 false
     */
    get isStopped(): boolean {
        return this.state.playStatus === PlayStatus.STOPPED
    }

    /**
     * 获取当前播放状态是否为缓冲中
     * @returns {boolean} 如果当前播放状态为缓冲中，则返回 true，否则返回 false
     */
    get isBuffering(): boolean {
        return this.state.playStatus === PlayStatus.BUFFERING
    }

    /**
     * 设置媒体类型
     * @param {MediaTypes} mediaType - 媒体类型
     */
    setMediaType(mediaType: MediaTypes): void {
        this.state.mediaType = mediaType
    }

    /**
     * 设置视频 ID, 主要针对 HLS 视频
     * @param {string} videoID - 视频 ID
     */
    setVideoID(videoID: string): void {
        this.state.videoID = videoID
    }

    /**
     * 设置视频源, 主要针对非 HLS 视频
     * @param {string} src - 视频源 URL
     */
    setSrc(src: string): void {
        this.state.src = src
    }

    /**
     * 设置封面图
     * @param {string} poster - 封面图 URL
     */
    setPoster(poster: string): void {
        this.state.poster = poster
    }

    /**
     * 设置视频所属文章 ID
     * @param {string} postID - 文章 ID
     */
    setPostID(postID: string): void {
        this.state.postId = postID
    }

    /**
     * 设置音量
     * @param {number} newVolume - 新的音量值，范围为 0 到 100
     */
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

    /**
     * 切换静音状态
     * 如果当前未静音，则将音量设置为 0 并标记为静音
     */
    toggleMute(): void {
        this.state.volume.muted = !this.state.volume.muted
        if (this.state.volume.muted) {
            this.state.volume.lastVolume = this.state.volume.volume
            this.state.volume.volume = 0
        } else {
            this.state.volume.volume = this.state.volume.lastVolume || 20
        }
    }

    /**
     * 开始播放视频
     */
    play(): void {
        this.state.playStatus = PlayStatus.PLAYING
    }

    /**
     * 暂停视频播放
     */
    pause(): void {
        this.state.playStatus = PlayStatus.PAUSED
    }

    /**
     * 停止视频播放
     */
    stop(): void {
        this.state.playStatus = PlayStatus.STOPPED
    }

    /**
     * 视频缓冲中
     */
    buffering(): void {
        this.state.playStatus = PlayStatus.BUFFERING
    }

    /**
     * 视频播放结束
     */
    end(): void {
        this.state.playStatus = PlayStatus.ENDED
    }

    /**
     * 切换播放和暂停状态
     */
    togglePlayPause(): void {
        if (this.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    /**
     * 设置播放进度
     */
    setPlayProgress(playProgress: PlayProgress): void {
        this.state.playProgress = playProgress
    }

    /**
     * 设置当前播放时间。
     */
    setCurrentTime(currentTime: number): void {
        this.state.playProgress.currentTime = currentTime
    }

    /**
     * 设置视频总时长。
     */
    setDuration(duration: number): void {
        this.state.playProgress.duration = duration
    }

    /**
     * 设置缓冲进度
     */
    setBuffered(buffered: number): void {
        this.state.playProgress.buffered = buffered
    }

    /**
     * 设置是否正在拖动进度条。
     */
    setIsDragging(isDragging: boolean): void {
        this.state.playProgress.isDragging = isDragging
    }

    /**
     * 快进 10 秒。
     */
    fastForward(): void {
        if (this.state.playProgress.currentTime + 10 >= this.state.playProgress.duration) {
            this.state.playProgress.currentTime = this.state.playProgress.duration
            return
        }
        this.state.playProgress.currentTime += 10
    }

    /**
     * 快退 10 秒。
     */
    rewind(): void {
        if (this.state.playProgress.currentTime - 10 <= 0) {
            this.state.playProgress.currentTime = 0
            return
        }
        this.state.playProgress.currentTime -= 10
    }

    /**
     * 切换全屏状态。
     */
    toggleFullScreen(): void {
        this.state.isFullScreen = !this.state.isFullScreen
        if (this.state.isFullScreen) {
            this.state.isWebFullScreen = false
        }
    }

    /**
     * 设置全屏状态。
     */
    setIsFullScreen(isFullScreen: boolean): void {
        this.state.isFullScreen = isFullScreen
    }

    /**
     * 切换网页全屏状态。
     */
    toggleWebFullScreen(): void {
        this.state.isWebFullScreen = !this.state.isWebFullScreen
        if (this.state.isWebFullScreen) {
            this.state.isFullScreen = false
        }
    }

    /**
     * 设置网页全屏状态。
     */
    setIsWebFullScreen(isWebFullScreen: boolean): void {
        this.state.isWebFullScreen = isWebFullScreen
    }

    /**
     * 退出全屏模式。
     */
    exitFullScreen(): void {
        this.state.isFullScreen = false
        this.state.isWebFullScreen = false
    }

    /**
     * 设置当前选择的播放质量。
     * @param {PlayLevelLabel} level - 选择的播放质量标签
     */
    setSelectedPlayLevel(level: PlayLevelLabel): void {
        this.state.playLevel.level = level
    }

    /**
     * 设置所有可用的播放质量选项。
     * @param {Record<string, number>} allLevels - 一个包含所有可用播放质量选项的对象，键为质量标签，值为对应的分辨率。
     * 例如: { "1080p": 1080, "720p": 720, "480p": 480 }
     */
    setPlayLevelAllLevels(allLevels: Record<string, number>): void {
        this.state.playLevel.allLevels = allLevels
    }

    /**
     * 设置播放速率
     * @param {PlaybackRate} playbackRate - 播放速率，必须是 PlaybackRate 枚举中的一个值
     */
    setPlaybackRate(playbackRate: PlaybackRate): void {
        this.state.playbackRate = playbackRate
    }

    /**
     *  切换控制栏的显示与隐藏状态。
     *  如果当前控制栏是显示状态，则切换为隐藏状态；如果当前是隐藏状态，则切换为显示状态。
     */
    toggleControlBar(): void {
        this.state.showControlBar = !this.state.showControlBar
    }

    /**
     * 切换是否使用浏览器默认的视频控件。
     */
    toggleVideoControls(): void {
        this.state.useVideoControls = !this.state.useVideoControls
    }

    /**
     * 设置播放器尺寸。
     * @param {number} width - 播放器宽度，单位为像素。
     * @param {number} height - 播放器高度，单位为像素。
     */
    setSize(width: number, height: number): void {
        this.state.size = { width, height }
    }

    /**
     * 设置当前选择的字幕语言。
     * @param {LanguageKey} language - 选择的字幕语言键，例如
     */
    setSelectedSubtitlesLanguage(language: LanguageKey): void {
        this.state.subtitles.selectedSubtitlesLanguage = language
    }

    /**
     * 设置可用字幕列表。
     * @param {Partial<Record<LanguageKey, SubtitlesItem>>} availableSubtitles - 包含可用字幕的对象，键为语言键，值为字幕项
     */
    setAvailableSubtitles(availableSubtitles: Partial<Record<LanguageKey, SubtitlesItem>>): void {
        this.state.subtitles.availableSubtitles = availableSubtitles
    }

    /**
     * 设置字幕
     * @param {Subtitles} subtitles - 包含可用字幕列表和当前选择的字幕语言的对象
     */
    setSubtitles(subtitles: Subtitles): void {
        this.state.subtitles = subtitles
    }

    /**
     * 根据当前视频的哈希 ID 自动设置字幕。
     * 如果当前视频 ID 为空，则不进行任何操作。
     * 否则，调用 createSubtitlesByVideoHashId 方法根据视频哈希 ID 获取字幕信息，并更新播放器状态中的字幕。
     */
    setSubtitlesByVideoHashIdAuto(): void {
        if (!this.state.videoID) return
        // 根据视频 hash ID 和字幕语言列表创建字幕对象
        createSubtitlesByVideoHashId(this.state.videoID, this.state).then((subtitles) => {
            this.setSubtitles(subtitles) // 设置字幕
        })
    }

    /**
     * 设置是否有目录
     */
    setHasToc(flag: boolean): void {
        this.state.hasToc = flag
    }

    /**
     * 设置是否显示目录
     */
    setIsShowToc(flag: boolean): void {
        this.state.isShowToc = flag
    }

    /**
     * 切换目录显示状态。
     */
    toggleIsShowToc(): void {
        this.state.isShowToc = !this.state.isShowToc
    }

    /**
     * 切换画中画模式。
     */
    togglePictureInPicture(): void {
        this.state.isPictureInPicture = !this.state.isPictureInPicture
    }

    /**
     * 设置是否为移动设备。
     * 该方法用于更新播放器状态中的 isMobile 属性，以便根据设备类型调整播放器行为。
     *
     * @param {boolean} isMobile - 如果为 true，则表示当前设备为移动设备，否则为 false。
     */
    setIsMobile(isMobile: boolean): void {
        this.state.isMobile = isMobile
    }

    /**
     * 设置文本水印。
     * @param {TextWatermark} textWatermark - 包含水印内容和样式的对象。
     */
    setTextWatermark(textWatermark: TextWatermark): void {
        if (!textWatermark.content) return
        this.state.textWatermark = textWatermark
    }

    /**
     * 设置 logo 水印。
     * @param {LogoWatermark} logoWatermark - 包含 logo URL 和样式的对象。
     */
    setLogoWatermark(logoWatermark: LogoWatermark): void {
        if (!logoWatermark.imgUrl) return
        this.state.logoWatermark = logoWatermark
    }

    /**
     * 切换循环播放状态。
     */
    toggleLoop(): void {
        this.state.isLoop = !this.state.isLoop
    }

    /**
     * 切换自动播放状态。
     */
    toggleAutoPlay(): void {
        this.state.autoPlay = !this.state.autoPlay
    }

    /**
     * 设置用户输入状态。
     * 该方法用于标记播放器状态中的 isUserInput 属性，以指示当前操作是否由用户直接触发。
     * 这对于区分用户操作和程序自动操作非常重要，例如在设置播放进度时。
     *
     * @param {boolean} flag - 如果为 true，则表示当前操作由用户触发；如果为 false，则表示非用户触发。
     */
    setUserInput(flag: boolean): void {
        this.state.isUserInput = flag
    }

    /**
     * 设置是否为 iPhone 设备。
     * 该方法用于更新播放器状态中的 isIphone 属性，以便根据设备类型调整播放器行为。
     *
     * @param {boolean} isIphone - 如果为 true，则表示当前设备为 iPhone，否则为 false。
     */
    setIsIphone(isIphone: boolean): void {
        this.state.isIphone = isIphone
    }

    /**
     * 切换是否启用快捷键功能。
     * 如果当前启用，则禁用快捷键功能；如果当前禁用，则启用快捷键功能。
     */
    toggleShortcutKey(): void {
        this.state.isShortcutKey = !this.state.isShortcutKey
    }

    /**
     * 设置是否启用快捷键功能。
     * @param {boolean} isShortcutKey - 如果为 true，则启用快捷键功能；如果为 false，则禁用快捷键功能。
     */
    setShortcutKey(isShortcutKey: boolean): void {
        this.state.isShortcutKey = isShortcutKey
    }

    /**
     * 清除所有创建的本地视频字幕 URL, 避免内存泄漏。
     * 调用此方法将撤销所有通过 URL.createObjectURL 创建的本地字幕 URL, 并清空本地字幕 URL 列表。
     * 该方法在播放器销毁或不再需要本地字幕时应被调用，以释放资源。
     */
    clearLocalVideoSubtitlesURLs(): void {
        if (this.state.localVideoSubtitlesURLs && this.state.localVideoSubtitlesURLs.length > 0) {
            this.state.localVideoSubtitlesURLs.forEach((url) => URL.revokeObjectURL(url))
            this.state.localVideoSubtitlesURLs.length = 0
        }
    }

    /**
     * 启动一个定时器，定期执行回调
     * @param callback 回调函数
     * @param interval 执行间隔，单位毫秒，默认 5000ms
     */
    startTimer(callback: () => void | Promise<void>, interval: number = 5000): void {
        this.stopTimer() // 避免重复启动

        if (interval <= 0) {
            console.warn("Timer interval must be greater than 0.")
            return
        }

        // 使用闭包变量避免并发调用(如果回调是异步且执行时间可能超过间隔)
        let isRunning = false

        this.state.timerId = window.setInterval(() => {
            if (isRunning) return
            isRunning = true

            // 支持同步或异步回调, 并捕获错误
            Promise.resolve()
                .then(() => callback())
                .catch((err) => {
                    console.error("Timer callback error:", err)
                })
                .finally(() => {
                    isRunning = false
                })
        }, interval)
    }

    /**
     * 停止当前运行的定时器
     */
    stopTimer(): void {
        if (this.state.timerId !== null) {
            clearInterval(this.state.timerId)
            this.state.timerId = null
        }
    }

    /**
     * 设置是否展示错误信息。
     * @param {boolean} flag - 如果为 true，则展示错误信息；如果为 false，则隐藏错误信息。
     */
    setShowError(flag: boolean): void {
        this.state.showError = flag
    }

    /**
     * 设置错误信息内容。
     * @param {string} msg - 错误信息内容字符串。
     */
    setErrMsg(msg: string): void {
        this.state.errMsg = msg
    }

    /**
     * 设置是否为管理员。
     * @param {boolean} flag - 如果为 true，则表示当前用户为管理员，否则为非管理员。
     */
    setIsAdmin(flag: boolean): void {
        this.state.isAdmin = flag
    }

    /**
     * 获取当前播放器状态
     * @returns {PlayerState} 当前播放器状态
     */
    getState(): PlayerState {
        return this.state
    }

    /**
     * 更新播放器状态
     * @param {PlayerState} state - 新的播放器状态
     */
    updateState(state: PlayerState): void {
        this.state = state
    }

    /**
     * 销毁播放器状态管理器实例，清理资源并重置状态。
     * 调用此方法后，播放器状态将恢复为默认状态。
     */
    destroy(): void {
        this.clearLocalVideoSubtitlesURLs()
        this.state = createDefaultPlayerState()
        this.stopTimer()
    }
}
