<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:53:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-24 12:33:02
 * @FilePath     : \blog-client\src\components\player\components\controls\index.vue
 * @Description  : 视频控制器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <!-- 视频控制器 -->
    <div class="controls">
        <!-- 视频进度条 -->
        <ProgressBar class="row1" :playProgress="playProgress" @seek="seekVideo" @is-dragging="handleIsDragging" />

        <!-- 第二行 -->
        <div class="row2">

            <!-- 第二行左侧 -->
            <div class="left-controls">
                <!-- 播放暂停按钮 -->
                <button class="controls-btn play-pause" @click="handleButtonClick(togglePlayPause)">
                    <Icon :name="IconNamePlayPause" customClass="iconfont" />
                </button>

                <!-- 时间显示 -->
                <div class="timeDisplay">{{ formattedTimeDisplay }}</div>
            </div>

            <!-- 第二行右侧 -->
            <div class="right-controls">
                <!-- 静音按钮 -->
                <button class="controls-btn volume-mute" @click="handleButtonClick(toggleMute)">
                    <Icon :name="IconNameMute" customClass="iconfont" />
                </button>

                <!-- 音量控制 -->
                <el-slider class="volume" v-model="localVolume" size="small" @input="seekVolume" />

                <!-- 设置 播放速度 清晰度 字幕 -->
                <!-- 使用 append-to 到对应元素才能保证全屏显示 -->
                <!-- 参考文档：https://element-plus.org/zh-CN/component/tooltip.html -->
                <el-popover :width="100" placement="top" :append-to="props.elPopoverAppendToElement" :teleported="true"
                    popper-class="video-el-popover" @hide="handleHideSetting" @show="handleShowSetting">
                    <template #reference>
                        <button class="controls-btn">
                            <Icon :name="IconKeys.Setting" customClass="iconfont" />
                        </button>
                    </template>
                    <VideoSetting class="setting" :is-show="isShowVideoSetting" :subtitles="subtitles"
                        :play-level="playLevel" :playback-rate="playbackRate" :is-loop="isLoop"
                        @selected-subtitles-language="handleSelectedSubtitleLanguage" @get-is-loop="handelIsLoop"
                        @get-play-level="handelPlayLevel" @get-playback-rate="handelPlaybackRate" />
                </el-popover>

                <!-- 画中画 -->
                <button class="controls-btn pip" @click="handleButtonClick(togglePIP)">
                    <Icon :name="IconKeys.PictureInPicture" customClass="iconfont" />
                </button>

                <!-- 网页全屏 -->
                <button class="controls-btn web-fullscreen" @click="handleButtonClick(toggleWebFullscreen)">
                    <Icon :name="IconKeys.WebFullscreen" customClass="iconfont" />
                </button>

                <!-- 全屏 -->
                <button class="controls-btn fullscreen" @click="handleButtonClick(toggleFullscreen)">
                    <Icon :name="IconKeys.Fullscreen" customClass="iconfont" />
                </button>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { IconKeys } from '@/components/common/icons'
import { formatDurationTime } from '@/utils/dateTime'
import ProgressBar from '@/components/player/components/progress-bar'
import VideoSetting from '@/components/player/components/setting'
import { useMagicKeys } from '@vueuse/core'
import { PlayerCommandsKey, PlayerCommands } from '@/components/player/command'
import { usePlayerStore, PlayStatus, PlaybackRate, PlayLevelLabel } from '@/stores/player'

// 名称
defineOptions({ name: 'VideoControls' })

// 定义 porps
const props = defineProps<{
    elPopoverAppendToElement: HTMLElement | null, // el-popover 的 append-to 属性
}>()

// 从 store 中获取数据
const playerStore = usePlayerStore()
const { playStatus, playProgress, playLevel, playbackRate, volume, subtitles, isLoop } = storeToRefs(playerStore)

// 定义图标名称
const IconNamePlayPause = ref(IconKeys.Pause)
const IconNameMute = ref(IconKeys.Unmute)

// 本地状态
const localVolume = ref(volume.value.volume)

// 设置视频进度值
const seekVideo = (currentTime: number) => {
    playerStore.setUserInput(true)
    // 设置当前时间
    playerStore.setCurrentTime(currentTime)
}

// 是否正在拖拽进度条
const handleIsDragging = (isDragging: boolean) => playerStore.setIsDragging(isDragging)

// 设置音量
const seekVolume = () => playerStore.setVolume(localVolume.value)

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
const togglePlayPause = () => playerStore.togglePlayPause()

// 切换静音
const toggleMute = () => playerStore.toggleMute()

// 视频时间显示
const formattedTimeDisplay = computed(() => {
    const currentFormatted = formatDurationTime(playProgress.value.currentTime)
    const durationFormatted = formatDurationTime(playProgress.value.duration)
    return `${currentFormatted} / ${durationFormatted}`
})

// 处理选择字幕语言
const handleSelectedSubtitleLanguage = (language: string) => {
    playerStore.setSelectedSubtitlesLanguage(language)
}

// 处理播放清晰度
const handelPlayLevel = (level: PlayLevelLabel) => playerStore.setSelectedPlayLevel(level)

// 处理播放速度
const handelPlaybackRate = (playbackRate: PlaybackRate) => playerStore.setPlaybackRate(playbackRate)

// 处理是否循环播放
const handelIsLoop = () => playerStore.toggleLoop()

// 切换画中画
const togglePIP = () => playerStore.togglePictureInPicture()

// 是否显示设置菜单
const isShowVideoSetting = ref(false)

// 隐藏设置菜单
const handleHideSetting = () => isShowVideoSetting.value = false

// 显示设置菜单
const handleShowSetting = () => isShowVideoSetting.value = true

// 切换网页全屏
const toggleWebFullscreen = () => playerStore.toggleWebFullScreen()

// 切换全屏
const toggleFullscreen = () => playerStore.toggleFullScreen()

// 处理按钮点击事件,点击完成后失去焦点, 防止键盘事件冲突,主要是快捷键.
const handleButtonClick = (action: () => void) => {
    action()
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
}

// 监控是否静音, 切换静音图标
watchEffect(() => {
    if (volume.value.muted) {
        IconNameMute.value = IconKeys.Mute
        localVolume.value = 0
    } else {
        IconNameMute.value = IconKeys.Unmute
        localVolume.value = volume.value.volume
    }
})

// 监控播放状态, 切换播放暂停图标
watchEffect(() => {
    if (playStatus.value === PlayStatus.PLAYING) {
        // 当播放状态为播放时，显示暂停图标
        IconNamePlayPause.value = IconKeys.Pause
    } else {
        // 当播放状态为暂停时，显示播放图标
        IconNamePlayPause.value = IconKeys.Play
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

@include respond-to('phone') {

    // 手机端隐藏如下按钮
    .volume-mute,
    .volume,
    .pip,
    .web-fullscreen {
        display: none;
    }

}
</style>
