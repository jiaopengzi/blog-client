/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 15:42:11
 * @LastPlayers  : jiaopengzi
 * @LastEditTime : 2024-09-10 16:54:27
 * @FilePath     : \blog-client\src\stores\player.ts
 * @Description  : 播放器 store
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { defineStore } from 'pinia'
import axios from 'axios'

// 播放状态
enum PlayStatus {
  PLAYING = 'playing', // 播放中
  PAUSED = 'paused', // 暂停
  STOPPED = 'stopped', // 停止
  BUFFERING = 'buffering', // 缓冲中
  ENDED = 'ended', // 播放结束
  ERROR = 'error', // 播放错误
}

// 播放质量
enum PlayLevel {
  EIGHT_K = '8k',
  FOUR_K = '4k',
  TWO_K = '2k',
  FULL_HD = '1080p',
  HD = '720p',
  SD = '480p',
}

// 播放速度
enum PlaySpeed {
  VERY_SLOW = 0.25,
  SLOW = 0.5,
  MEDIUM_SLOW = 0.75,
  NORMAL = 1,
  FAST = 1.5,
  FASTER = 2,
  VERY_FAST = 4,
}

// 播放进度
interface PlayProgress {
  currentTime: number // 当前播放时间（以秒为单位）
  duration: number // 总时长（以秒为单位）
}

// 字幕
interface Subtitle {
  language: string // 字幕语言，例如 'en', 'zh', 'es' 等
  label: string // 字幕标签，例如 'English', '中文', 'Español' 等
  url: string // 字幕文件的URL
}

// 字幕状态
interface SubtitleStatus {
  hasSubtitles: boolean // 是否有字幕
  availableSubtitles?: Subtitle[] // 可用字幕列表
  selectedSubtitle?: Subtitle // 当前选择的字幕（如果有）
}

// 位置
interface Position {
  x: number | string // 水平位置，可以是像素值（例如 100）或百分比字符串（例如 '50%'）
  y: number | string // 垂直位置，可以是像素值（例如 100）或百分比字符串（例如 '50%'）
}

// logo
interface Logo {
  isShow: boolean // 是否显示 logo
  url: string // logo 的 URL 地址
  width: number // logo 的宽度（像素）
  height: number // logo 的高度（像素）
  position: Position // logo 的位置
}

// 水印类型
enum WatermarkType {
  TEXT = 'text',
  LOGO = 'logo',
}

// 文字水印
interface TextWatermark {
  type: WatermarkType.TEXT // 类型为 'text'
  content: string // 水印内容，例如 'Sample Watermark'
  position: Position // 水印的位置
  opacity: number // 水印透明度，范围从 0 (完全透明) 到 1 (完全不透明)
  fontSize: string // 水印字体大小，例如 '14px', '1em' 等
  color: string // 水印颜色，例如 '#FFFFFF'
}

// logo 水印
interface LogoWatermark {
  type: WatermarkType.LOGO // 类型为 'logo'
  logo: Logo // logo 属性
}

// 水印
type Watermark = TextWatermark | LogoWatermark

// 播放器尺寸
interface PlayerSize {
  width: number // 播放器宽度（像素）
  height: number // 播放器高度（像素）
}

// 播放器 store
export interface PlayerStore {
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
  playSpeed: PlaySpeed
  // 音量
  volume: number
  // 是否静音
  isMuted: boolean
  // 是否显示控制栏
  showControlBar: boolean
  // 使用 video 默认 controls
  useVideoControls: boolean
  // 播放器尺寸
  size: PlayerSize
  // 字幕
  subtitles?: SubtitleStatus
  // 画中画
  isPictureInPicture: boolean
  // 水印
  watermark?: Watermark
  // logo
  logo?: Logo
}

// 定义 store
export const usePlayerStore = defineStore({
  id: 'player',
  state: (): PlayerStore => ({
    playStatus: PlayStatus.STOPPED,
    playProgress: { currentTime: 0, duration: 0 },
    isWebFullScreen: false,
    isFullScreen: false,
    playLevel: PlayLevel.FULL_HD,
    playSpeed: PlaySpeed.NORMAL,
    volume: 50, // 默认音量
    isMuted: false,
    showControlBar: true,
    useVideoControls: false,
    subtitles: { hasSubtitles: false },
    isPictureInPicture: false,
    size: { width: 640, height: 360 },
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
    // 设置音量
    setVolume(newVolume: number) {
      if (newVolume < 0) {
        this.volume = 0
      } else if (newVolume > 100) {
        this.volume = 100
      } else {
        this.volume = newVolume
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
    // 设置播放进度
    setPlayProgress(currentTime: number, duration: number) {
      this.playProgress = { currentTime, duration }
    },
    // 切换全屏状态
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.isWebFullScreen = false
      }
    },
    // 切换网页全屏状态
    toggleWebFullScreen() {
      this.isWebFullScreen = !this.isWebFullScreen
      if (this.isWebFullScreen) {
        this.isFullScreen = false
      }
    },
    // 设置播放质量
    setPlayLevel(level: PlayLevel) {
      this.playLevel = level
    },
    // 设置播放速度
    setPlaySpeed(speed: PlaySpeed) {
      this.playSpeed = speed
    },
    // 设置静音状态
    toggleMute() {
      this.isMuted = !this.isMuted
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
    setSubtitles(subtitles: SubtitleStatus) {
      this.subtitles = subtitles
    },
    // 设置画中画状态
    togglePictureInPicture() {
      this.isPictureInPicture = !this.isPictureInPicture
    },
    // 设置水印
    setWatermark(watermark: Watermark) {
      this.watermark = watermark
    },
    // 设置 logo
    setLogo(logo: Logo) {
      this.logo = logo
    },
  },
})
