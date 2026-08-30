<!--
 * FilePath    : blog-client-nuxt\src\components\player\components\controls\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频控制器
-->

<template>
    <!-- 视频控制器 -->
    <div class="controls">
        <!-- 视频进度条 -->
        <ProgressBar class="row1" :play-progress="localPlayerState.playProgress" @seek="seekVideo" @is-dragging="handleIsDragging" />

        <!-- 第二行 -->
        <div class="row2">
            <!-- 第二行左侧 -->
            <div class="left-controls">
                <!-- 播放暂停按钮 -->
                <button type="button" class="controls-btn play-pause" @click="handleButtonClick(togglePlayPause)">
                    <j-icon :name="IconNamePlayPause" custom-class="iconfont" />
                </button>

                <!-- 时间显示 -->
                <div class="timeDisplay">{{ formattedTimeDisplay }}</div>
            </div>

            <!-- 第二行右侧 -->
            <div class="right-controls">
                <div class="volume-wrapper" @mouseenter="onVolumeEnter" @mouseleave="hideVolumeBar">
                    <!-- 静音按钮 -->
                    <button type="button" class="controls-btn volume-mute" @click="handleButtonClick(toggleMute)">
                        <j-icon :name="IconNameMute" custom-class="iconfont" />
                    </button>

                    <!-- 音量控制 -->
                    <VolumeBar class="volume-bar" :class="{ visible: isVolumeBarVisible }" :volume="localVolume" @update-volume="seekVolume" />
                </div>

                <!-- 目录显示切换 -->
                <button v-if="localPlayerState.hasToc" type="button" class="controls-btn toc" @click="handleButtonClick(toggleIsShowToc)">
                    <j-icon :name="IconKeys.Toc" custom-class="iconfont" />
                </button>

                <!-- 画中画 -->
                <button type="button" class="controls-btn pip" @click="handleButtonClick(togglePIP)">
                    <j-icon :name="IconKeys.PictureInPicture" custom-class="iconfont" />
                </button>

                <!-- 网页全屏 -->
                <button type="button" class="controls-btn web-fullscreen" @click="handleButtonClick(toggleWebFullscreen)">
                    <j-icon :name="IconKeys.WebFullscreen" custom-class="iconfont" />
                </button>

                <!-- 全屏 -->
                <button type="button" class="controls-btn fullscreen" @click="handleButtonClick(toggleFullscreen)">
                    <j-icon :name="fullscreenIconName" custom-class="iconfont" />
                </button>

                <!-- 设置 播放速度 清晰度 字幕 -->
                <div ref="settingWrapperRef" class="setting-wrapper" @mouseenter="onSettingEnter" @mouseleave="hideSetting">
                    <button type="button" class="controls-btn" @click="onSettingToggle">
                        <j-icon :name="IconKeys.Setting" custom-class="iconfont" />
                    </button>

                    <VideoSetting
                        class="settings"
                        :class="{ visible: isShowVideoSetting }"
                        :subtitles="localPlayerState.subtitles"
                        :play-level="localPlayerState.playLevel"
                        :playback-rate="localPlayerState.playbackRate"
                        :is-loop="localPlayerState.isLoop"
                        @selected-subtitles-language="handleSelectedSubtitleLanguage"
                        @get-is-loop="handelIsLoop"
                        @get-play-level="handelPlayLevel"
                        @get-playback-rate="handelPlaybackRate"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMagicKeys, onClickOutside } from "@vueuse/core"
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue"

import { IconKeys } from "@/components/common/icons"
import JIcon from "@/components/common/icons"
import { useDelayedToggle } from "@/components/hooks/useDelayedToggle"
import { createPlayerCommands, PlayerCommandsKey } from "@/components/player/command"
import ProgressBar from "@/components/player/components/progress-bar"
import VideoSetting from "@/components/player/components/setting"
import VolumeBar from "@/components/player/components/volume-bar"
import { PlayerStateManager } from "@/components/player/state"
import { type LanguageKey, PlaybackRate, type PlayerState, PlayLevelLabel, PlayStatus } from "@/components/player/types"
import { formatDurationTime } from "@/utils/dateTime"

defineOptions({ name: "VideoControls" })

const { playerState } = defineProps<{
    playerState: PlayerState
}>()

const emit = defineEmits<{
    (e: "update-status", status: PlayerState): void
}>()

// 将 playerState 包裹为本地响应式对象
const localPlayerState = reactive<PlayerState>(playerState)

const localManager = new PlayerStateManager(localPlayerState)

const IconNamePlayPause = ref(IconKeys.Pause)
const IconNameMute = ref(IconKeys.Unmute)

const localVolume = ref(localPlayerState.volume.volume)

const seekVideo = (currentTime: number) => {
    localManager.setUserInput(true)
    localManager.setCurrentTime(currentTime)
}

// 是否正在拖拽进度条
const handleIsDragging = (isDragging: boolean) => localManager.setIsDragging(isDragging)

// 注册快捷键: useMagicKeys() 之后可通过 keys 获取键盘按键状态
const keys = useMagicKeys()

let registeredWatchers: (() => void)[] = []

const unRegisterHotKeys = () => {
    registeredWatchers.forEach((stop) => stop())
    registeredWatchers = []
}

const playerCommands = createPlayerCommands(localManager)

const registerHotKeys = () => {
    // 注册前先注销之前的快捷键监听
    unRegisterHotKeys()

    Object.values(PlayerCommandsKey).forEach((item) => {
        const hotKey = playerCommands[item].hotKey
        if (hotKey) {
            let intervalId: number | null = null // 用于存储长按的定时器 id

            watch(keys[hotKey]!, (v) => {
                // v 为 true 时表示按下了快捷键, 为 false 时释放了快捷键
                // 只有当快捷键功能开启时才响应
                if (v && localPlayerState.isShortcutKey) {
                    // 执行普通按键逻辑
                    if (playerCommands[item].action) playerCommands[item].action()

                    if (playerCommands[item].longPressAction) {
                        // 开始检测长按
                        intervalId = window.setInterval(() => {
                            if (playerCommands[item].longPressAction) playerCommands[item].longPressAction()
                        }, 200) // 200ms 作为长按的阈值
                    }
                } else {
                    // 清除长按定时器
                    if (intervalId) {
                        clearInterval(intervalId)
                        intervalId = null
                    }
                }
            })

            registeredWatchers.push(stop)
        }
    })
}

const togglePlayPause = () => localManager.togglePlayPause()

const toggleMute = () => {
    localManager.toggleMute()
}

const seekVolume = (volume: number) => {
    localManager.setVolume(volume)
    localVolume.value = volume
}

// 音量条: 悬停显示, 移出后短延时隐藏(不做定时自动关闭, 避免交互中突然消失)
const { isVisible: isVolumeBarVisible, show: showVolumeBar, hide: hideVolumeBar, destroy: volumeDestroy } = useDelayedToggle(150)
// 设置菜单: 点击/悬停显示, 移出或点击外部关闭(不做定时自动关闭, 避免查看时突然消失)
const settingWrapperRef = ref<HTMLElement | null>(null)
const { isVisible: isShowVideoSetting, show: showSetting, hide: hideSetting, toggle: toggleSetting, destroy: settingDestroy } = useDelayedToggle(150)

// 点击设置菜单外部时关闭, 覆盖触控端(无 mouseleave)的关闭场景
onClickOutside(settingWrapperRef, () => {
    if (isShowVideoSetting.value) hideSetting()
})

// 互斥显示: 悬停音量条时立即隐藏设置面板, 避免两个悬浮面板重叠
const onVolumeEnter = () => {
    hideSetting()
    showVolumeBar()
}

// 互斥显示: 悬停设置面板时立即隐藏音量条
const onSettingEnter = () => {
    hideVolumeBar()
    showSetting()
}

// 点击设置按钮切换时同样隐藏音量条, 保证同一时刻只显示一个面板
const onSettingToggle = () => {
    hideVolumeBar()
    toggleSetting()
}

const formattedTimeDisplay = computed(() => {
    const currentFormatted = formatDurationTime(localPlayerState.playProgress.currentTime)
    const durationFormatted = formatDurationTime(localPlayerState.playProgress.duration)
    return `${currentFormatted}/${durationFormatted}`
})

/**
 * fullscreenIconName 根据播放器原生全屏状态返回控制栏图标。
 * 这里只处理播放器全屏按钮, 不影响网页全屏按钮的既有显示逻辑。
 */
const fullscreenIconName = computed(() => {
    return localPlayerState.isFullScreen ? IconKeys.FullscreenExit : IconKeys.Fullscreen
})

// 处理选择字幕语言
const handleSelectedSubtitleLanguage = (language: LanguageKey) => {
    localManager.setSelectedSubtitlesLanguage(language)
}

// 处理播放清晰度
const handelPlayLevel = (level: PlayLevelLabel) => localManager.setSelectedPlayLevel(level)

const handelPlaybackRate = (playbackRate: PlaybackRate) => localManager.setPlaybackRate(playbackRate)

const handelIsLoop = () => localManager.toggleLoop()

// 切换目录显示
const toggleIsShowToc = () => localManager.toggleIsShowToc()

// 切换画中画
const togglePIP = () => localManager.togglePictureInPicture()

const toggleWebFullscreen = () => localManager.toggleWebFullScreen()

const toggleFullscreen = () => localManager.toggleFullScreen()

// 处理按钮点击事件, 点击完成后失去焦点, 防止键盘事件冲突 (主要是快捷键)
const handleButtonClick = (action: () => void) => {
    action()
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
}

// 监控是否静音, 切换静音图标
watch(
    () => localPlayerState.volume.muted,
    (muted) => {
        if (muted) {
            IconNameMute.value = IconKeys.Mute
            localVolume.value = 0
        } else {
            IconNameMute.value = IconKeys.Unmute
            localVolume.value = localPlayerState.volume.volume
        }
    },
)

// 监控播放状态, 切换播放暂停图标
watch(
    () => localPlayerState.playStatus,
    (playStatus) => {
        if (playStatus === PlayStatus.PLAYING) {
            // 播放中显示暂停图标
            IconNamePlayPause.value = IconKeys.Pause
        } else {
            // 暂停时显示播放图标
            IconNamePlayPause.value = IconKeys.Play
        }
    },
    { immediate: true },
)

// 监控播放器状态, 有变化就 emit
watch(
    () => localPlayerState,
    (newVal) => {
        emit("update-status", newVal)
    },
    { deep: true },
)

onMounted(() => {
    registerHotKeys()
})

onUnmounted(() => {
    unRegisterHotKeys()
    volumeDestroy()
    settingDestroy()
})
</script>

<style lang="scss">
.controls {
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    justify-content: center;

    .row2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        margin: 0 16px;

        .iconfont {
            font-size: 20px;
            fill: #ffffffe6;
            transition: fill 0.3s ease;
        }

        .iconfont:hover {
            fill: #ffffffff;
        }

        .left-controls {
            display: flex;
            align-items: center;

            .timeDisplay {
                font-family: "JBMonoWOFF2", monospace;
                white-space: nowrap;
                margin: 0 10px;
            }
        }

        .right-controls {
            display: flex;
            align-items: center;

            .volume-wrapper {
                position: relative;
                display: inline-flex;
                align-items: center;

                .volume-bar {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-bottom: 8px;
                    // 用 visibility 代替 display, 保持毛玻璃层合成, 避免悬停时先透明后模糊
                    visibility: hidden;
                    z-index: 10;

                    &.visible {
                        visibility: visible;
                    }
                }
            }

            // 手机端隐藏音量调节
            @include respond-to("phone") {
                .volume-wrapper {
                    display: none;
                }
            }

            .setting-wrapper {
                position: relative;
                display: inline-flex;
                align-items: center;

                .settings {
                    position: absolute;
                    bottom: 40px;
                    right: 0%;
                    margin-bottom: 8px;
                    // 用 visibility 代替 display, 保持毛玻璃层合成, 避免悬停时先透明后模糊
                    visibility: hidden;
                    z-index: 10;

                    &.visible {
                        visibility: visible;
                    }
                }
            }
        }
    }
}

.controls-btn {
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 2px;
    transition:
        transform 0.2s ease,
        background-color 0.2s ease;

    &:hover {
        transform: scale(1.2);
        background-color: #ffffff1a;
    }

    &:active {
        transform: scale(1.1);
        background-color: #ffffff33;
    }
}

// 取消播放暂停按钮的默认内外边距, 和进度条对齐
.play-pause {
    margin: 0;
    padding: 0;
}

@include respond-to("pad") {
    // pad 端隐藏如下按钮
    .pip,
    .web-fullscreen {
        display: none;
    }
}

@include respond-to("phone") {
    // 手机端隐藏如下按钮
    .pip,
    .web-fullscreen {
        display: none;
    }

    .timeDisplay {
        font-size: 13px;
    }
}
</style>
