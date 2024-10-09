/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-07 17:53:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-18 16:13:51
 * @FilePath     : \blog-client\src\components\player\command\constant.ts
 * @Description  : 播放器命令常量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from '@/components/common/icons'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'

export enum PlayerCommandsKey {
  // 播放暂停
  PalyPause = 'palyPause',
  // 全屏
  Fullscreen = 'fullscreen',
  // 网页全屏
  WebFullscreen = 'webFullscreen',
  // 画中画
  PictureInPicture = 'pictureInPicture',
  // 静音
  Mute = 'mute',
  // 音量增加
  VolumeUp = 'volumeUp',
  // 音量减小
  VolumeDown = 'volumeDown',
  // 快进
  FastForward = 'fastForward',
  // 快退
  Rewind = 'rewind',
  // 退出全屏
  ExitFullscreen = 'exitFullscreen'

  // // 上一个
  // Previous = 'previous',
  // // 下一个
  // Next = 'next',
  // // 循环播放
  // RepeatOne = 'repeatOne',
  // // 随机播放
  // Shuffle = 'shuffle',
  // // 列表循环
  // Repeat = 'repeat',
  // // 播放速度
  // PlaybackRate = 'playbackRate',
  // // 展示列表
  // ShowList = 'showList',
}

// 播放器命令类型
export interface PlayerCommandItemType {
  tip?: string // 前端提示
  hotKey?: string // 快捷键
  action?: Function // 执行函数
  longPressAction?: Function // 长按执行函数
  icon?: IconKeys // 图标名称
}

// 使用映射类型定义 PlayerCommandsType
export type PlayerCommandsType = {
  [key in PlayerCommandsKey]: PlayerCommandItemType
}

// 从 store 中获取数据
const playerStore = usePlayerStore()
const { volume } = storeToRefs(playerStore)

// 播放器器 所有 排序 命令 集合对象
export const PlayerCommands: PlayerCommandsType = {
  [PlayerCommandsKey.PalyPause]: {
    tip: '播放/暂停',
    hotKey: 'Space',
    action: () => playerStore.togglePlayPause()
  },
  [PlayerCommandsKey.Fullscreen]: {
    tip: '全屏',
    hotKey: 'F',
    action: () => {
      playerStore.toggleFullScreen()
    }
  },
  [PlayerCommandsKey.WebFullscreen]: {
    tip: '网页全屏',
    hotKey: 'W',
    action: () => playerStore.toggleWebFullScreen()
  },

  [PlayerCommandsKey.PictureInPicture]: {
    tip: '画中画',
    hotKey: 'P',
    action: () => playerStore.togglePictureInPicture()
  },

  [PlayerCommandsKey.Mute]: {
    tip: '静音',
    hotKey: 'M',
    action: () => playerStore.toggleMute()
  },
  [PlayerCommandsKey.VolumeUp]: {
    tip: '音量增加',
    hotKey: 'ArrowUp',
    action: () => playerStore.setVolume(volume.value.volume + 10),
    longPressAction: () => playerStore.setVolume(volume.value.volume + 20)
  },
  [PlayerCommandsKey.VolumeDown]: {
    tip: '音量减小',
    hotKey: 'ArrowDown',
    action: () => playerStore.setVolume(volume.value.volume - 10),
    longPressAction: () => playerStore.setVolume(volume.value.volume - 20)
  },
  [PlayerCommandsKey.FastForward]: {
    tip: '快进',
    hotKey: 'ArrowRight',
    action: () => {
      playerStore.setUserInput(true)
      playerStore.fastForward()
    },
    longPressAction: () => {
      playerStore.setUserInput(true)
      playerStore.fastForward()
    }
  },
  [PlayerCommandsKey.Rewind]: {
    tip: '快退',
    hotKey: 'ArrowLeft',
    action: () => {
      playerStore.setUserInput(true)
      playerStore.rewind()
    },
    longPressAction: () => {
      playerStore.setUserInput(true)
      playerStore.rewind()
    }
  },
  [PlayerCommandsKey.ExitFullscreen]: {
    tip: '退出全屏',
    hotKey: 'Escape'
    // action: () => playerStore.exitFullScreen(),
  }

  // [PlayerCommandsKey.Previous]: {
  //   tip: '上一个',
  //   hotKey: 'Ctrl+Shift+ArrowLeft',
  // },
  // [PlayerCommandsKey.Next]: {
  //   tip: '下一个',
  //   hotKey: 'Ctrl+Shift+ArrowRight',
  // },
  // [PlayerCommandsKey.RepeatOne]: {
  //   tip: '循环播放',
  //   hotKey: 'R',
  // },
  // [PlayerCommandsKey.Shuffle]: {
  //   tip: '随机播放',
  //   hotKey: 'S',
  // },
  // [PlayerCommandsKey.Repeat]: {
  //   tip: '列表循环',
  //   hotKey: 'L',
  // },
  // [PlayerCommandsKey.PlaybackRate]: {
  //   tip: '播放速度',
  //   hotKey: 'P',
  // },
  // [PlayerCommandsKey.ShowList]: {
  //   tip: '展示列表',
  //   hotKey: 'L',
  // },
}
