<!--
 * FilePath    : blog-client-nuxt\src\components\player\components\setting\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频设置 - 播放速度、清晰度、字幕
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

const { subtitles, playLevel, playbackRate, isLoop } = defineProps<{
    subtitles: Subtitles | undefined
    playLevel: PlayLevel
    playbackRate: PlaybackRate
    isLoop: boolean
}>()

const emit = defineEmits<{
    (e: "selected-subtitles-language", language: LanguageKey): void
    (e: "get-play-level", level: PlayLevelLabel): void
    (e: "get-playback-rate", playbackRate: PlaybackRate): void
    (e: "get-is-loop", value: boolean): void
}>()

const isShowSubtitlesSelect = computed(() => {
    return subtitles?.availableSubtitles && Object.keys(subtitles.availableSubtitles).length > 0
})

const subtitlesOptions = computed<RadioOption<LanguageKey>[]>(() => {
    // 增加一个禁用的选项, key: disabled, label: disabled
    if (!subtitles || !subtitles.availableSubtitles) return []
    const options: RadioOption<LanguageKey>[] = []

    options.push({ label: Language.disabled, value: "disabled" })

    for (const [key, item] of Object.entries(subtitles.availableSubtitles)) {
        options.push({ label: item.label, value: key as LanguageKey })
    }
    return options
})

// 只有一个清晰度选项时不显示; playLevel.allLevels 是 Record<string, number> 类型
const isShowPlayLevel = computed(() => Object.keys(playLevel.allLevels).length > 1)

// 清晰度选项
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

const selectedSubtitlesLanguage = ref(subtitles?.selectedSubtitlesLanguage)
const selectedPlayLevel = ref(playLevel.level)
const selectedPlaybackRate = ref(playbackRate)
const localIsLoop = ref(isLoop)

const handleSubtitlesChange = (language: LanguageKey | undefined) => {
    if (!language) return
    selectedSubtitlesLanguage.value = language
    emit("selected-subtitles-language", language)
}

const handlePlaySpeedChange = (playbackRate: PlaybackRate) => {
    selectedPlaybackRate.value = playbackRate
    emit("get-playback-rate", playbackRate)
}

const handlePlayLevelChange = (level: PlayLevelLabel) => {
    selectedPlayLevel.value = level as PlayLevelLabel
    emit("get-play-level", level)
}

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

    // 半透明深色底 + 毛玻璃模糊, 保证悬浮面板可读(进一步降低暗度, 更通透)
    background-color: #00000066;
    backdrop-filter: blur(16px);
    border-radius: 4px;
    box-shadow: 0 8px 24px #00000066;

    // 滚动条样式: 常驻可见的轨道与滑块, 提示用户可向下滚动
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background-color: #ffffff1a;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ffffff80;
        border-radius: 4px;

        &:hover {
            background-color: #ffffffb3;
        }
    }

    // 手机端限制高度, 避免面板超出视频容器
    @include respond-to("phone") {
        height: 100px;
    }
}
</style>
