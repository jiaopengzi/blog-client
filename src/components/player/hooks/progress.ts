/**
 * FilePath    : blog-client\src\components\player\hooks\progress.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 播放进度恢复
 */

import { ref, type Reactive, type Ref } from "vue"

import { PlayerStateManager } from "../state"
import { type PlayerState } from "../types"

/**
 * 管理播放器的待恢复进度。
 *
 * @param videoRef video 元素引用。
 * @param localManager 播放器状态管理器。
 * @param localPlayerState 播放器响应式状态。
 * @returns 返回进度入队, 同步和按 video 状态更新的方法。
 */
export function useProgress(videoRef: Ref<HTMLVideoElement | null>, localManager: PlayerStateManager, localPlayerState: Reactive<PlayerState>) {
    const pendingSeekTime = ref<number | null>(null)

    /**
     * 记录待恢复的播放进度, 等待 video 元素进入可 seek 状态后再应用。
     *
     * @param currentTime 待恢复的播放时间, 单位为秒。
     */
    const queueSeekTime = (currentTime: number) => {
        if (!Number.isFinite(currentTime) || currentTime < 0) {
            return
        }

        pendingSeekTime.value = currentTime
    }

    /**
     * 将待恢复的播放进度同步到真实 video 元素。
     *
     * @returns 如果本次成功应用了待恢复进度, 则返回 true, 否则返回 false。
     */
    const syncPendingSeekTime = () => {
        if (!videoRef.value || pendingSeekTime.value === null) {
            return false
        }

        if (videoRef.value.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
            return false
        }

        const duration = Number.isFinite(videoRef.value.duration) ? videoRef.value.duration : 0
        const seekTime = duration > 0 ? Math.min(pendingSeekTime.value, duration) : pendingSeekTime.value

        videoRef.value.currentTime = seekTime
        localManager.setCurrentTime(seekTime)
        pendingSeekTime.value = null
        localManager.setUserInput(false)
        return true
    }

    /**
     * 根据 video 元素更新播放器状态, 并在可用时尝试恢复历史进度。
     */
    const updateStateByVideo = () => {
        if (videoRef.value) {
            localManager.setDuration(videoRef.value.duration)
            localManager.setPlaybackRate(videoRef.value.playbackRate)
            videoRef.value.loop = localPlayerState.isLoop
            videoRef.value.volume = localPlayerState.volume.volume / 100
            localManager.setIsDragging(false)

            queueSeekTime(localPlayerState.playProgress.currentTime)
            syncPendingSeekTime()
        }
    }

    return {
        queueSeekTime,
        syncPendingSeekTime,
        updateStateByVideo,
    }
}
