<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:53:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-15 14:13:21
 * @FilePath     : \blog-client\src\components\player\components\controls\index.vue
 * @Description  : 视频控制器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <!-- 视频控制器 -->
    <div ref="controls" class="controls">
        <!-- 视频进度条 -->
        <ProgressBar class="row1" ref="progressBar" :playProgress="playProgress" @seek="seekVideo" />

        <!-- 第二行 -->
        <div class="row2">

            <!-- 第二行左侧 -->
            <div class="left-controls">
                <!-- 播放暂停按钮 -->
                <button ref="playPause" class="controls-btn play-pause" @click="togglePlayPause">
                    <Icon :name="IconNamePlayPause" customClass="iconfont" />
                </button>

                <!-- 时间显示 -->
                <div ref="timeDisplay" class="timeDisplay">{{ timeDisplay }}</div>
            </div>

            <!-- 第二行右侧 -->
            <div class="right-controls">
                <!-- 静音按钮 -->
                <button ref="mute" class="controls-btn" @click="toggleMute">
                    <Icon :name="IconNameMute" customClass="iconfont" />
                </button>

                <!-- 音量控制 -->
                <el-slider ref="volume" class="volume" v-model="volume.volume" size="small" @input="seekVolume" />

                <!-- 设置 播放速度 清晰度 字幕 -->
                <el-popover placement="top">
                    <template #reference>
                        <button ref="setting" class="controls-btn">
                            <Icon :name="IconKeys.Setting" customClass="iconfont" />
                        </button>
                    </template>
                    <VideoSetting :subtitle-status="subtitles" :play-level="playLevel" :play-speed="playSpeed"
                        :is-loop="isLoop" @selected-subtitle-language="handleSelectedSubtitleLanguage"
                        @get-is-loop="handelIsLoop" @get-play-level="handelPlayLevel"
                        @get-play-speed="handelPlaySpeed" />
                </el-popover>


                <button ref=" pip" class="controls-btn" @click="togglePIP">
                    <Icon :name="IconKeys.PictureInPicture" customClass="iconfont" />
                </button>

                <!-- 网页全屏 -->
                <button ref="webFullscreen" class="controls-btn" @click="toggleWebFullscreen">
                    <Icon :name="IconKeys.WebFullscreen" customClass="iconfont" />
                </button>

                <!-- 全屏 -->
                <button ref="fullscreen" class="controls-btn" @click="toggleFullscreen">
                    <Icon :name="IconKeys.Fullscreen" customClass="iconfont" />
                </button>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed, watch, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { IconKeys } from '@/components/common/icons'
import { formatDurationTime } from '@/utils/dateTime'
import ProgressBar from '@/components/player/components/progress-bar'
import VideoSetting from '@/components/player/components/setting'
import { debounce } from 'throttle-debounce'
import { useMagicKeys } from '@vueuse/core'
import { PlayerCommandsKey, PlayerCommands } from '@/components/player/command'


import { usePlayerStore, PlayStatus, PlayLevelItem, PlaySpeed, WatermarkType } from '@/stores/player'
import type { PlayProgress, Subtitle, SubtitleStatus, Position, Logo, TextWatermark, Watermark, PlayerSize } from '@/stores/player'
import { handleConfirmCommon } from '@/utils/confirm'


defineOptions({ name: 'VideoControls' })

// 从 store 中获取数据
const palyerStore = usePlayerStore()
const { playStatus, playProgress, isWebFullScreen, isFullScreen,
    playLevel, playSpeed, volume, showControlBar,
    useVideoControls, subtitles, isPictureInPicture, size, isMobile, isLoop } = storeToRefs(palyerStore)


// 定义所有的元素的 ref
const controlsRef = useTemplateRef<HTMLElement | null>("controls")
const playPauseRef = useTemplateRef<HTMLButtonElement | null>("playPause")
const progressBarRef = useTemplateRef<HTMLDivElement | null>("progressBar")
const timeDisplayRef = useTemplateRef<HTMLSpanElement | null>("timeDisplay")
const volumeRef = useTemplateRef<HTMLInputElement | null>("volume")
const settingRef = useTemplateRef<HTMLButtonElement | null>("setting")
const pipRef = useTemplateRef<HTMLButtonElement | null>("pip")
const webFullscreenRef = useTemplateRef<HTMLButtonElement | null>("webFullscreen")
const fullscreenRef = useTemplateRef<HTMLButtonElement | null>("fullscreen")
const sliderRef = useTemplateRef<HTMLDivElement | null>("slider") // 新增滑块的 ref

// 定义图标名称
const IconNamePlayPause = ref(IconKeys.Pause)
const IconNameMute = ref(IconKeys.Unmute)

// 设置视频进度值
const seekVideo = (currentTime: number) => {
    playProgress.value.currentTime = currentTime
}

// 设置音量
const seekVolume = () => {
    palyerStore.setVolume(volume.value.volume)
}

// 注册快捷键
const keys = useMagicKeys() // 使用 useMagicKeys() 之后，就可以通过 keys 来获取键盘按键的状态了
const registerHotKeys = () => {
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
                            if (PlayerCommands[item].longPressAction) PlayerCommands[item].longPressAction()
                        }, 200) // 200ms 作为长按的阈值
                    }

                } else {
                    // 清除长按定时器
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }
            })
        }
    })
}


// 切换播放暂停
const togglePlayPause = () => {
    palyerStore.togglePlayPause()
}


// 切换静音
const toggleMute = () => {
    palyerStore.toggleMute()
}

// 视频时间显示
const timeDisplay = computed(() => {
    const currentFormatted = formatDurationTime(playProgress.value.currentTime)
    const durationFormatted = formatDurationTime(playProgress.value.duration)
    return `${currentFormatted} / ${durationFormatted}`
})

// 处理选择字幕语言
const handleSelectedSubtitleLanguage = (language: string) => {
    palyerStore.setSelectedSubtitleLanguage(language)
}

// 处理播放清晰度
const handelPlayLevel = (level: PlayLevelItem) => {
    palyerStore.setSelectedPlayLevel(level)
}

// 处理播放速度
const handelPlaySpeed = (speed: PlaySpeed) => {
    palyerStore.setPlaySpeed(speed)
}

// 处理是否循环播放
const handelIsLoop = () => {
    palyerStore.toggleLoop()
}

// 切换画中画
const togglePIP = () => {
    palyerStore.togglePictureInPicture()
}

// 切换网页全屏
const toggleWebFullscreen = () => {
    palyerStore.toggleWebFullScreen()
}

// 切换全屏
const toggleFullscreen = () => {
    palyerStore.toggleFullScreen()
}


// 监控是否静音, 切换静音图标
watchEffect(() => {
    if (volume.value.muted) {
        IconNameMute.value = IconKeys.Mute
    } else {
        IconNameMute.value = IconKeys.Unmute
    }
})


// 监控播放状态, 切换播放暂停图标
watchEffect(() => {
    if (playStatus.value === PlayStatus.PLAYING) {
        IconNamePlayPause.value = IconKeys.Play
    } else {
        IconNamePlayPause.value = IconKeys.Pause
    }
})


onMounted(() => {
    registerHotKeys() // 注册快捷键
})

</script>

<style scoped lang="scss">
.controls {
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.2);

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
            fill: rgba(255, 255, 255, 1.0);
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
            transition: transform 0.2s ease, background-color 0.2s ease;

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
</style>