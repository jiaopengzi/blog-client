/*
 * FilePath    : blog-client-nuxt\src\components\player\command\constant.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 播放器命令常量
 */

import { IconKeys } from "@/components/common/icons"
import { PlayerStateManager } from "@/components/player"

export enum PlayerCommandsKey {
    PalyPause = "palyPause",
    Fullscreen = "fullscreen",
    WebFullscreen = "webFullscreen",
    PictureInPicture = "pictureInPicture",
    Mute = "mute",
    VolumeUp = "volumeUp",
    VolumeDown = "volumeDown",
    FastForward = "fastForward",
    Rewind = "rewind",
    ExitFullscreen = "exitFullscreen",
}

export interface PlayerCommandItemType {
    tip?: string
    hotKey?: string
    action?: () => void
    longPressAction?: () => void
    icon?: IconKeys
}

// 使用映射类型定义 PlayerCommandsType
export type PlayerCommandsType = {
    [key in PlayerCommandsKey]: PlayerCommandItemType
}

/**
 * @description: 创建播放器命令
 * @param playerStateManager 播放器状态管理器
 * @return {PlayerCommandsType} 播放器命令
 */
export function createPlayerCommands(playerStateManager: PlayerStateManager): PlayerCommandsType {
    const { volume } = playerStateManager.getState()

    return {
        [PlayerCommandsKey.PalyPause]: {
            tip: "播放/暂停",
            hotKey: "Space",
            action: () => playerStateManager.togglePlayPause(),
        },
        [PlayerCommandsKey.Fullscreen]: {
            tip: "全屏",
            hotKey: "F",
            action: () => playerStateManager.toggleFullScreen(),
        },
        [PlayerCommandsKey.WebFullscreen]: {
            tip: "网页全屏",
            hotKey: "W",
            action: () => playerStateManager.toggleWebFullScreen(),
        },
        [PlayerCommandsKey.PictureInPicture]: {
            tip: "画中画",
            hotKey: "P",
            action: () => playerStateManager.togglePictureInPicture(),
        },
        [PlayerCommandsKey.Mute]: {
            tip: "静音",
            hotKey: "M",
            action: () => playerStateManager.toggleMute(),
        },
        [PlayerCommandsKey.VolumeUp]: {
            tip: "音量增加",
            hotKey: "ArrowUp",
            action: () => playerStateManager.setVolume(volume.volume + 10),
            longPressAction: () => playerStateManager.setVolume(volume.volume + 20),
        },
        [PlayerCommandsKey.VolumeDown]: {
            tip: "音量减小",
            hotKey: "ArrowDown",
            action: () => playerStateManager.setVolume(volume.volume - 10),
            longPressAction: () => playerStateManager.setVolume(volume.volume - 20),
        },
        [PlayerCommandsKey.FastForward]: {
            tip: "快进",
            hotKey: "ArrowRight",
            action: () => {
                playerStateManager.setUserInput(true)
                playerStateManager.fastForward()
            },
            longPressAction: () => {
                playerStateManager.setUserInput(true)
                playerStateManager.fastForward()
            },
        },
        [PlayerCommandsKey.Rewind]: {
            tip: "快退",
            hotKey: "ArrowLeft",
            action: () => {
                playerStateManager.setUserInput(true)
                playerStateManager.rewind()
            },
            longPressAction: () => {
                playerStateManager.setUserInput(true)
                playerStateManager.rewind()
            },
        },
        [PlayerCommandsKey.ExitFullscreen]: {
            tip: "退出全屏",
            hotKey: "Escape",
            action: () => playerStateManager.exitFullScreen(),
        },
    }
}
