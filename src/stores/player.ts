/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 15:42:11
 * @LastPlayers  : jiaopengzi
 * @LastEditTime : 2024-09-18 22:03:26
 * @FilePath     : \blog-client\src\stores\player.ts
 * @Description  : 播放器 store
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { defineStore } from 'pinia'
import axios from 'axios'

// 播放状态
export enum PlayStatus {
  PLAYING = 'playing', // 播放中
  PAUSED = 'paused', // 暂停
  STOPPED = 'stopped', // 停止
  BUFFERING = 'buffering', // 缓冲中
  ENDED = 'ended', // 播放结束
  ERROR = 'error', // 播放错误
}

// 播放质量
export enum PlayLevelItem {
  EIGHT_K = '8k',
  FOUR_K = '4k',
  TWO_K = '2k',
  FULL_HD = '1080p',
  HD = '720p',
  SD = '480p',
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
  level: PlayLevelItem // 播放质量
  allLevels: PlayLevelItem[] // 所有可用的播放质量
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

// 字幕
export interface SubtitlesItem {
  label: string // 字幕标签，例如 'English', '中文', 'Español' 等
  src: string // 字幕文件的URL
}

// 定义 disabled 字幕
export const DisabledSubtitles: { [language: string]: SubtitlesItem } = {
  disabled: {
    label: '禁用',
    src: '',
  },
}

// 字幕状态
export interface Subtitles {
  availableSubtitles?: { [language: string]: SubtitlesItem } // 可用字幕列表,字幕语言，例如 'en', 'zh', 'es' 等
  selectedSubtitlesLanguage?: string // 当前选择的字幕的语言 key 默认值 disabled
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

// 播放器 store
export interface PlayerStore {
  // 视频地址
  src: string
  // 海报
  poster?: string
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
  // 画中画
  isPictureInPicture: boolean
  // 是否为移动端
  isMobile: boolean
  // 水印
  textWatermark?: TextWatermark
  logoWatermark?: LogoWatermark
  // 是否循环播放
  isLoop: boolean
  // 是否自动播放
  autoPlay: boolean
  // 是否用户输入
  isUserInput: boolean
}

// 定义 store
export const usePlayerStore = defineStore({
  id: 'player',
  state: (): PlayerStore => ({
    src: '',
    playStatus: PlayStatus.STOPPED,
    playProgress: { currentTime: 0, duration: 2004, isDragging: false },
    isWebFullScreen: false,
    isFullScreen: false,
    playLevel: {
      level: PlayLevelItem.FULL_HD,
      allLevels: [PlayLevelItem.TWO_K, PlayLevelItem.FULL_HD, PlayLevelItem.HD, PlayLevelItem.SD],
    },
    playbackRate: PlaybackRate.NORMAL,
    volume: {
      volume: 20, // 默认音量
      muted: false, // 是否静音
      lastVolume: 50, // 静
    }, // 默认音量
    showControlBar: true,
    useVideoControls: false,
    isPictureInPicture: false,
    size: { width: 720, height: 405 },
    isMobile: false,
    isLoop: false,
    textWatermark: {
      content: 'jiaopengzi.com',
      style: {
        color: 'red',
        fontSize: '14px',
      },
    },
    logoWatermark: {
      imgUrl: 'https://jiaopengzi.com/wp-content/uploads/2021/10/220-50-1-YJ.png',
      style: {
        width: '131px',
        height: '30px',
        right: '0',
        top: '20px',
        opacity: '1',
      },
    },
    autoPlay: false,
    isUserInput: false,
    subtitles: {
      selectedSubtitlesLanguage: 'disabled',
    },
  }),
  getters: {
    // 获取当前播放状态是否为播放中
    isPlaying: (state) => state.playStatus === PlayStatus.PLAYING,
    // 获取当前播放状态是否为暂停
    isPaused: (state) => state.playStatus === PlayStatus.PAUSED,
    // 获取当前播放状态是否为停止
    isStopped: (state) => state.playStatus === PlayStatus.STOPPED,
    // 获取当前播放状态是否为缓冲中
    isBuffering: (state) => state.playStatus === PlayStatus.BUFFERING,
  },

  actions: {
    // 初始化播放器 store 数据
    init(playerStore: PlayerStore) {
      Object.assign(this, playerStore)
    },

    // 设置视频地址
    setSrc(src: string) {
      this.src = src
    },

    // 设置音量
    setVolume(newVolume: number) {
      this.volume.lastVolume = this.volume.volume
      if (newVolume <= 0) {
        this.volume.volume = 0
        this.volume.muted = true
      } else if (newVolume > 100) {
        this.volume.lastVolume = 100
        this.volume.muted = false
      } else {
        this.volume.volume = newVolume
        this.volume.muted = false
      }
    },

    // 设置静音状态
    toggleMute() {
      this.volume.muted = !this.volume.muted
      if (this.volume.muted) {
        this.volume.lastVolume = this.volume.volume
        this.volume.volume = 0
      } else {
        this.volume.volume = this.volume.lastVolume || 20
      }
    },

    // 播放
    play() {
      this.playStatus = PlayStatus.PLAYING
    },

    // 暂停
    pause() {
      this.playStatus = PlayStatus.PAUSED
    },

    // 停止
    stop() {
      this.playStatus = PlayStatus.STOPPED
    },

    // 缓冲
    buffering() {
      this.playStatus = PlayStatus.BUFFERING
    },

    // 播放结束
    end() {
      this.playStatus = PlayStatus.ENDED
    },

    // 切换播放/暂停状态
    togglePlayPause() {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play()
      }
    },

    // 设置播放进度
    setPlayProgress(playProgress: PlayProgress) {
      this.playProgress = playProgress
    },

    // 设置当前播放时间
    setCurrentTime(currentTime: number) {
      this.playProgress.currentTime = currentTime
    },

    // 设置总时长
    setDuration(duration: number) {
      this.playProgress.duration = duration
    },

    // 设置缓冲进度
    setBuffered(buffered: number) {
      this.playProgress.buffered = buffered
    },

    // 设置总时长
    setIsDragging(isDragging: boolean) {
      this.playProgress.isDragging = isDragging
    },

    // 快进
    fastForward() {
      // 判断当前播放时间是否大于总时长
      if (this.playProgress.currentTime + 10 >= this.playProgress.duration) {
        this.playProgress.currentTime = this.playProgress.duration
        return
      }
      this.playProgress.currentTime += 10
    },

    // 快退
    rewind() {
      // 判断当前播放时间是否小于 0
      if (this.playProgress.currentTime - 10 <= 0) {
        this.playProgress.currentTime = 0
        return
      }
      this.playProgress.currentTime -= 10
    },

    // 切换全屏状态
    toggleFullScreen() {
      console.log('toggleFullScreen')
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.isWebFullScreen = false
      }
    },

    // 设置全屏状态
    setIsFullScreen(isFullScreen: boolean) {
      this.isFullScreen = isFullScreen
    },

    // 切换网页全屏状态
    toggleWebFullScreen() {
      this.isWebFullScreen = !this.isWebFullScreen
      if (this.isWebFullScreen) {
        this.isFullScreen = false
      }
    },

    // 设置网页全屏状态
    setIsWebFullScreen(isWebFullScreen: boolean) {
      this.isWebFullScreen = isWebFullScreen
    },

    // 退出全屏
    exitFullScreen() {
      console.log('exitFullScreen')
      this.isFullScreen = false
      this.isWebFullScreen = false
    },

    // 设置播放质量
    setSelectedPlayLevel(levelItem: PlayLevelItem) {
      this.playLevel.level = levelItem
    },

    // 设置播放质量
    setPlayLevel(playLevel: PlayLevel) {
      this.playLevel = playLevel
    },

    // 设置播放速度
    setPlaybackRate(playbackRate: PlaybackRate) {
      this.playbackRate = playbackRate
    },

    // 设置是否显示控制栏
    toggleControlBar() {
      this.showControlBar = !this.showControlBar
    },

    // 设置使用 video 默认 controls
    toggleVideoControls() {
      this.useVideoControls = !this.useVideoControls
    },

    // 设置播放器尺寸
    setPlayerSize(width: number, height: number) {
      this.size = { width, height }
    },

    // 设置字幕
    setSelectedSubtitlesLanguage(language: string) {
      // 如果字幕可用且选择的字幕语言存在
      this.subtitles.selectedSubtitlesLanguage = language
    },

    // 设置可选字幕
    setAvailableSubtitles(availableSubtitles: { [language: string]: SubtitlesItem }) {
      this.subtitles.availableSubtitles = availableSubtitles
    },

    // 设置画中画状态
    togglePictureInPicture() {
      this.isPictureInPicture = !this.isPictureInPicture
    },

    // 设置是否是移动端状态
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },

    // 设置文字水印
    setTextWatermark(textWatermark: TextWatermark) {
      this.textWatermark = textWatermark
    },

    // 设置 logo 水印
    setLogoWatermark(logoWatermark: LogoWatermark) {
      this.logoWatermark = logoWatermark
    },

    // 设置是否循环播放
    toggleLoop() {
      this.isLoop = !this.isLoop
    },

    // 设置是否自动播放
    toggleAutoPlay() {
      this.autoPlay = !this.autoPlay
    },

    // 设置是否用户输入
    setUserInput(flag: boolean) {
      this.isUserInput = flag
    },
  },
})
