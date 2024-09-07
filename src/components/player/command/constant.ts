/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-07 17:53:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-07 18:52:18
 * @FilePath     : \blog-client\src\components\player\command\constant.ts
 * @Description  : 播放器命令常量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from '@/components/common/icons'

export enum PlayerCommandsKey {
  // 播放
  Paly = 'paly',
  // 暂停
  Pause = 'pause',
  // 全屏
  Fullscreen = 'fullscreen',
  // 网页全屏
  WebFullscreen = 'webFullscreen',
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
  // 上一个
  Previous = 'previous',
  // 下一个
  Next = 'next',
  // 循环播放
  RepeatOne = 'repeatOne',
  // 随机播放
  Shuffle = 'shuffle',
  // 列表循环
  Repeat = 'repeat',
  // 播放速度
  PlaybackRate = 'playbackRate',
  // 展示列表
  ShowList = 'showList',
}

// 播放器命令类型
export interface PlayerCommandItemType {
  tip?: string // 前端提示
  hotKey?: string // 快捷键
  action?: Function // 执行函数
  icon?: IconKeys // 图标名称
}

// 使用映射类型定义 PlayerCommandsType
export type PlayerCommandsType = {
  [key in PlayerCommandsKey]: PlayerCommandItemType
}

// 播放器器 所有 排序 命令 集合对象
export const PlayerCommands: PlayerCommandsType = {
  [PlayerCommandsKey.Paly]: {
    tip: '播放',
    hotKey: 'Space',
  },
  [PlayerCommandsKey.Pause]: {
    tip: '暂停',
    hotKey: 'Space',
  },
  [PlayerCommandsKey.Fullscreen]: {
    tip: '全屏',
    hotKey: 'F',
  },
  [PlayerCommandsKey.WebFullscreen]: {
    tip: '网页全屏',
    hotKey: 'W',
  },
  [PlayerCommandsKey.Mute]: {
    tip: '静音',
    hotKey: 'M',
  },
  [PlayerCommandsKey.VolumeUp]: {
    tip: '音量增加',
    hotKey: 'ArrowUp',
  },
  [PlayerCommandsKey.VolumeDown]: {
    tip: '音量减小',
    hotKey: 'ArrowDown',
  },
  [PlayerCommandsKey.FastForward]: {
    tip: '快进',
    hotKey: 'ArrowRight',
  },
  [PlayerCommandsKey.Rewind]: {
    tip: '快退',
    hotKey: 'ArrowLeft',
  },
  [PlayerCommandsKey.Previous]: {
    tip: '上一个',
    hotKey: 'Ctrl+Shift+ArrowLeft',
  },
  [PlayerCommandsKey.Next]: {
    tip: '下一个',
    hotKey: 'Ctrl+Shift+ArrowRight',
  },
  [PlayerCommandsKey.RepeatOne]: {
    tip: '循环播放',
    hotKey: 'R',
  },
  [PlayerCommandsKey.Shuffle]: {
    tip: '随机播放',
    hotKey: 'S',
  },
  [PlayerCommandsKey.Repeat]: {
    tip: '列表循环',
    hotKey: 'L',
  },
  [PlayerCommandsKey.PlaybackRate]: {
    tip: '播放速度',
    hotKey: 'P',
  },
  [PlayerCommandsKey.ShowList]: {
    tip: '展示列表',
    hotKey: 'L',
  },
}
