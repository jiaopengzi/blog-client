<!--
 * @FilePath     : \blog-client\src\components\player\components\setting\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 视频设置 - 播放速度、清晰度、字幕
-->

<template>
    <div class="video-settings">
        <RadioGroup v-if="isShowSubtitlesSelect" v-model="selectedSubtitlesLanguage" :options="subtitlesOptions" title="字幕" @change="handleSubtitlesChange" />
        <RadioGroup v-if="isShowPlayLevel" v-model="selectedPlayLevel" :options="levelOptions" title="清晰度" @change="handlePlayLevelChange" />
        <RadioGroup v-model="selectedPlaybackRate" :options="ratesOptions" title="播放速度" @change="handlePlaySpeedChange" />
        <RadioGroup v-model="localIsLoop" :options="loopOptions" title="播放" @change="handleIsLoopChange" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { Language, type LanguageKey, PlaybackRate, type PlayLevel, PlayLevelLabel, type Subtitles } from "../../types"
import RadioGroup, { type RadioOption } from "./radio-group"

defineOptions({ name: "VideoSetting" })

// 定义props
const { subtitles, playLevel, playbackRate, isLoop } = defineProps<{
    subtitles: Subtitles | undefined
    playLevel: PlayLevel
    playbackRate: PlaybackRate
    isLoop: boolean
}>()

// 定义 emit
const emit = defineEmits<{
    (e: "selected-subtitles-language", language: LanguageKey): void // 选择字幕
    (e: "get-play-level", level: PlayLevelLabel): void // 播放清晰度
    (e: "get-playback-rate", playbackRate: PlaybackRate): void // 播放速度
    (e: "get-is-loop", value: boolean): void // 是否循环播放
}>()

// 是否显示字幕选择组件
const isShowSubtitlesSelect = computed(() => {
    // 判断 subtitles?.availableSubtitles 是否存在或者为空对象
    return subtitles?.availableSubtitles && Object.keys(subtitles.availableSubtitles).length > 0
})

// 可用字幕
const subtitlesOptions = computed<RadioOption<LanguageKey>[]>(() => {
    // 增加一个禁用的选项 ,key：disabled，label：disabled
    if (!subtitles || !subtitles.availableSubtitles) return []
    const options: RadioOption<LanguageKey>[] = []

    options.push({ label: Language.disabled, value: "disabled" })

    for (const [key, item] of Object.entries(subtitles.availableSubtitles)) {
        options.push({ label: item.label, value: key as LanguageKey })
    }
    return options
})

// 只有一个清晰度选项时不显示 playLevel.allLevels 是 Record<string, number> 类型
const isShowPlayLevel = computed(() => Object.keys(playLevel.allLevels).length > 1)

// 播放速度选项
const levelOptions = computed(() => {
    const options: RadioOption<PlayLevelLabel>[] = []
    for (const [key] of Object.entries(playLevel.allLevels)) {
        options.push({ label: key, value: key as PlayLevelLabel })
    }
    return options
})

const ratesOptions = computed(() => {
    const options: RadioOption<PlaybackRate>[] = []
    const speeds = Object.values(PlaybackRate).filter((value) => typeof value === "number") as PlaybackRate[]
    for (const speed of speeds) {
        options.push({ label: speed.toString(), value: speed })
    }
    return options
})

const loopOptions: RadioOption<boolean>[] = [
    { label: "单次", value: false },
    { label: "循环", value: true },
]

// 本地状态
const selectedSubtitlesLanguage = ref(subtitles?.selectedSubtitlesLanguage)
const selectedPlayLevel = ref(playLevel.level)
const selectedPlaybackRate = ref(playbackRate)
const localIsLoop = ref(isLoop)

// 处理字幕选择变化
const handleSubtitlesChange = (language: LanguageKey | undefined) => {
    if (!language) return
    selectedSubtitlesLanguage.value = language
    emit("selected-subtitles-language", language)
}

// 处理播放速度变化
const handlePlaySpeedChange = (playbackRate: PlaybackRate) => {
    selectedPlaybackRate.value = playbackRate
    emit("get-playback-rate", playbackRate)
}

// 处理播放清晰度变化
const handlePlayLevelChange = (level: PlayLevelLabel) => {
    selectedPlayLevel.value = level as PlayLevelLabel
    emit("get-play-level", level)
}

// 处理是否循环播放变化
const handleIsLoopChange = (value: boolean) => {
    localIsLoop.value = value
    emit("get-is-loop", value)
}
</script>

<style scoped lang="scss">
.video-settings {
    padding: 8px;
    width: 240px;
    height: 160px;
    overflow: auto;

    // 半透明背景色
    background-color: #00000022;
    // background-color: var(--jpz-bg-color);
    // border: 1px solid var(--jpz-border-color);
    border-radius: 4px;

    // 滚动条样式宽度
    &::-webkit-scrollbar {
        width: 4px;
    }

    @include respond-to("phone") {
        height: 100px;
    }
}
</style>
