<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:53:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-18 19:08:19
 * @FilePath     : \blog-client\src\components\player\components\controls\index.vue
 * @Description  : 视频控制器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <!-- 视频控制器 -->
    <div class="controls">
        <!-- 视频进度条 -->
        <ProgressBar
            class="row1"
            :play-progress="localPlayerProps.playProgress"
            @seek="seekVideo"
            @is-dragging="handleIsDragging"
        />

        <!-- 第二行 -->
        <div class="row2">
            <!-- 第二行左侧 -->
            <div class="left-controls">
                <!-- 播放暂停按钮 -->
                <button class="controls-btn play-pause" @click="handleButtonClick(togglePlayPause)">
                    <Icon :name="IconNamePlayPause" custom-class="iconfont" />
                </button>

                <!-- 时间显示 -->
                <div class="timeDisplay">{{ formattedTimeDisplay }}</div>
            </div>

            <!-- 第二行右侧 -->
            <div class="right-controls">
                <!-- 静音按钮 -->
                <button class="controls-btn volume-mute" @click="handleButtonClick(toggleMute)">
                    <Icon :name="IconNameMute" custom-class="iconfont" />
                </button>

                <!-- 音量控制 -->
                <el-slider class="volume" v-model="localVolume" size="small" @input="seekVolume" />

                <!-- 设置 播放速度 清晰度 字幕 -->
                <!-- 使用 append-to 到对应元素才能保证全屏显示 -->
                <!-- 参考文档：https://element-plus.org/zh-CN/component/tooltip.html -->
                <el-popover
                    :width="100"
                    placement="top"
                    :append-to="elPopoverAppendToElement"
                    :teleported="true"
                    popper-class="video-el-popover"
                    @hide="handleHideSetting"
                    @show="handleShowSetting"
                >
                    <template #reference>
                        <button class="controls-btn">
                            <Icon :name="IconKeys.Setting" custom-class="iconfont" />
                        </button>
                    </template>
                    <VideoSetting
                        class="setting"
                        :is-show="isShowVideoSetting"
                        :subtitles="localPlayerProps.subtitles"
                        :play-level="localPlayerProps.playLevel"
                        :playback-rate="localPlayerProps.playbackRate"
                        :is-loop="localPlayerProps.isLoop"
                        @selected-subtitles-language="handleSelectedSubtitleLanguage"
                        @get-is-loop="handelIsLoop"
                        @get-play-level="handelPlayLevel"
                        @get-playback-rate="handelPlaybackRate"
                    />
                </el-popover>

                <!-- 画中画 -->
                <button class="controls-btn pip" @click="handleButtonClick(togglePIP)">
                    <Icon :name="IconKeys.PictureInPicture" custom-class="iconfont" />
                </button>

                <!-- 网页全屏 -->
                <button
                    class="controls-btn web-fullscreen"
                    @click="handleButtonClick(toggleWebFullscreen)"
                >
                    <Icon :name="IconKeys.WebFullscreen" custom-class="iconfont" />
                </button>

                <!-- 全屏 -->
                <button
                    class="controls-btn fullscreen"
                    @click="handleButtonClick(toggleFullscreen)"
                >
                    <Icon :name="IconKeys.Fullscreen" custom-class="iconfont" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, watchEffect } from "vue"
import { IconKeys } from "@/components/common/icons"
import { formatDurationTime } from "@/utils/dateTime"
import ProgressBar from "@/components/player/components/progress-bar"
import VideoSetting from "@/components/player/components/setting"
import { useMagicKeys } from "@vueuse/core"
import { PlayerCommandsKey, PlayerCommands } from "@/components/player/command"
import { UsePlayerProps, PlayStatus, PlaybackRate, PlayLevelLabel } from "@/components/player"
import type { PlayerProps, LanguageKey } from "@/components/player"

// 名称
defineOptions({ name: "VideoControls" })

// 定义 props
const { elPopoverAppendToElement, playerProps } = defineProps<{
    elPopoverAppendToElement: HTMLElement | null // el-popover 的 append-to 属性
    playerProps: PlayerProps // 播放器状态
}>()

// 定义 emit
const emit = defineEmits<{
    (e: "update-status", status: PlayerProps): void
}>()

// 拿到播放器的状态
const localPlayerState = ref<UsePlayerProps>(new UsePlayerProps(playerProps))

// 将 playerProps 包裹成 ref
const localPlayerProps = ref<PlayerProps>(playerProps)

// 定义图标名称
const IconNamePlayPause = ref(IconKeys.Pause)
const IconNameMute = ref(IconKeys.Unmute)

// 本地状态
const localVolume = ref(localPlayerProps.value.volume.volume)

// 设置视频进度值
const seekVideo = (currentTime: number) => {
    localPlayerState.value.setUserInput(true)
    // 设置当前时间
    localPlayerState.value.setCurrentTime(currentTime)
}

// 是否正在拖拽进度条
const handleIsDragging = (isDragging: boolean) => localPlayerState.value.setIsDragging(isDragging)

// 设置音量
const seekVolume = () => localPlayerState.value.setVolume(localVolume.value)

// 注册快捷键 使用 useMagicKeys() 之后，就可以通过 keys 来获取键盘按键的状态了
const keys = useMagicKeys()

// 注册的监听器
let registeredWatchers: (() => void)[] = []

// 注销快捷键
const unRegisterHotKeys = () => {
    registeredWatchers.forEach((stop) => stop())
    registeredWatchers = []
}

const registerHotKeys = () => {
    // 注册前先注销所有已注册的监听器
    unRegisterHotKeys()

    Object.values(PlayerCommandsKey).forEach((item) => {
        const hotKey = PlayerCommands[item].hotKey
        if (hotKey) {
            let intervalId: number | null = null // 用于存储长按的定时器 id

            watch(keys[hotKey], (v) => {
                // v 为 true 时表示按下了快捷键 v 为 false 时释放了快捷键
                // console.log('hotKey', hotKey, v)
                // console.log('item[0]', item)
                if (v) {
                    // 执行普通按键逻辑
                    if (PlayerCommands[item].action) PlayerCommands[item].action()

                    // 按下快捷键
                    if (PlayerCommands[item].longPressAction) {
                        // 开始检测长按
                        intervalId = window.setInterval(() => {
                            if (PlayerCommands[item].longPressAction)
                                PlayerCommands[item].longPressAction()
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

            // 注册监听器
            registeredWatchers.push(stop)
        }
    })
}

// 切换播放暂停
const togglePlayPause = () => localPlayerState.value.togglePlayPause()

// 切换静音
const toggleMute = () => localPlayerState.value.toggleMute()

// 视频时间显示
const formattedTimeDisplay = computed(() => {
    const currentFormatted = formatDurationTime(localPlayerProps.value.playProgress.currentTime)
    const durationFormatted = formatDurationTime(localPlayerProps.value.playProgress.duration)
    return `${currentFormatted} / ${durationFormatted}`
})

// 处理选择字幕语言
const handleSelectedSubtitleLanguage = (language: LanguageKey) => {
    localPlayerState.value.setSelectedSubtitlesLanguage(language)
}

// 处理播放清晰度
const handelPlayLevel = (level: PlayLevelLabel) =>
    localPlayerState.value.setSelectedPlayLevel(level)

// 处理播放速度
const handelPlaybackRate = (playbackRate: PlaybackRate) =>
    localPlayerState.value.setPlaybackRate(playbackRate)

// 处理是否循环播放
const handelIsLoop = () => localPlayerState.value.toggleLoop()

// 切换画中画
const togglePIP = () => localPlayerState.value.togglePictureInPicture()

// 是否显示设置菜单
const isShowVideoSetting = ref(false)

// 隐藏设置菜单
const handleHideSetting = () => (isShowVideoSetting.value = false)

// 显示设置菜单
const handleShowSetting = () => (isShowVideoSetting.value = true)

// 切换网页全屏
const toggleWebFullscreen = () => localPlayerState.value.toggleWebFullScreen()

// 切换全屏
const toggleFullscreen = () => localPlayerState.value.toggleFullScreen()

// 处理按钮点击事件,点击完成后失去焦点, 防止键盘事件冲突,主要是快捷键.
const handleButtonClick = (action: () => void) => {
    action()
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
}

// 监控是否静音, 切换静音图标
watchEffect(() => {
    if (localPlayerProps.value.volume.muted) {
        IconNameMute.value = IconKeys.Mute
        localVolume.value = 0
    } else {
        IconNameMute.value = IconKeys.Unmute
        localVolume.value = localPlayerProps.value.volume.volume
    }
})

// 监控播放状态, 切换播放暂停图标
watchEffect(() => {
    if (localPlayerProps.value.playStatus === PlayStatus.PLAYING) {
        // 当播放状态为播放时，显示暂停图标
        IconNamePlayPause.value = IconKeys.Pause
    } else {
        // 当播放状态为暂停时，显示播放图标
        IconNamePlayPause.value = IconKeys.Play
    }
})

// 监控快捷键开关
watch(
    () => localPlayerProps.value.isShortcutKey,
    (newVal) => {
        if (newVal) {
            registerHotKeys()
        } else {
            unRegisterHotKeys()
        }
    },
    { immediate: true },
)

// 监控播放器状态,有变化就 emit
watch(
    () => localPlayerProps.value,
    (newVal) => {
        emit("update-status", newVal)
    },
    { deep: true },
)

// onMounted(() => {
//     registerHotKeys() // 注册快捷键
// })

onUnmounted(() => {
    unRegisterHotKeys() // 注销快捷键
})
</script>

<style scoped lang="scss">
.controls {
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.1);

    // 垂直居中
    display: flex;
    flex-direction: column;
    justify-content: center;

    .row2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;

        .iconfont {
            font-size: 20px;
            fill: rgba(255, 255, 255, 0.9);
            transition: fill 0.3s ease;
        }

        .iconfont:hover {
            fill: rgba(255, 255, 255, 1);
        }

        .left-controls {
            display: flex;
            align-items: center;

            .timeDisplay {
                white-space: nowrap;
                margin: 0 10px;
            }
        }

        .right-controls {
            display: flex;
            align-items: center;

            .volume {
                width: 100px;
                margin: 0 8px;
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
                background-color: rgba(255, 255, 255, 0.1);
            }

            &:active {
                transform: scale(1.1);
                background-color: rgba(255, 255, 255, 0.2);
            }
        }
    }
}

@include respond-to("pad") {
    // pad端隐藏如下按钮
    .volume-mute,
    .volume,
    .pip,
    .web-fullscreen {
        display: none;
    }
}

@include respond-to("phone") {
    // 手机端隐藏如下按钮
    .volume-mute,
    .volume,
    .pip,
    .web-fullscreen {
        display: none;
    }
}
</style>
