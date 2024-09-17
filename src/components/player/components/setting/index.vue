<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-14 10:53:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-17 17:27:36
 * @FilePath     : \blog-client\src\components\player\components\setting\index.vue
 * @Description  : 视频设置 - 播放速度、清晰度、字幕
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-collapse class="video-settings" v-model="localActiveNames" @change="handleChange">

        <!-- 字幕选择 -->
        <el-collapse-item v-if="isShowSubtitleSelect" name="1">
            <template #title>
                <div class="title-content">
                    字幕
                </div>
            </template>
            <el-radio-group class="radio-group" v-model="selectedSubtitle" @change="handleSubtitleChange">
                <el-radio class="radio-item" v-for="(subtitle, key) in availableSubtitles" :key="key" :value="key">
                    {{ availableSubtitles[key]?.label }}
                </el-radio>
            </el-radio-group>
        </el-collapse-item>

        <!-- 播放清晰度选择 -->
        <el-collapse-item v-if="isShowPlayLevel" name="2">
            <template #title>
                <div class="title-content">
                    清晰度
                </div>
            </template>
            <el-radio-group class="radio-group" v-model="selectedPlayLevel" @change="handlePlayLevelChange">
                <el-radio class="radio-item" v-for="level in props.playLevel.allLevels" :key="level" :value="level">
                    {{ level }}
                </el-radio>
            </el-radio-group>
        </el-collapse-item>

        <!-- 播放速度选择 -->
        <el-collapse-item name="3">
            <template #title>
                <div class="title-content">
                    播放速度
                </div>
            </template>
            <el-radio-group class="radio-group" v-model="selectedPlaySpeed" @change="handlePlaySpeedChange">
                <el-radio class="radio-item" v-for="speed in Object.values(PlaySpeed)" :key="speed" :value="speed">
                    {{ speed }}
                </el-radio>
            </el-radio-group>
        </el-collapse-item>

        <!-- 循环播放 -->
        <el-collapse-item name="4">
            <template #title>
                <div class="title-content">
                    循环播放
                </div>
            </template>
            <el-switch class="switch" v-model="isLoop" inline-prompt active-text="on" inactive-text="off"
                @change="handleIsLoopChange" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SubtitleStatus, Subtitle, PlayLevel } from '@/stores/player'
import { PlaySpeed, PlayLevelItem } from '@/stores/player'

defineOptions({ name: 'VideoSetting' })

// 定义props
const props = defineProps<{
    isShow: boolean
    subtitleStatus: SubtitleStatus | undefined
    playLevel: PlayLevel
    playSpeed: PlaySpeed
    isLoop: boolean
}>()

// 定义 emit
const emit = defineEmits<{
    (e: 'selected-subtitle-language', language: string): void // 选择字幕
    (e: 'get-play-level', level: PlayLevelItem): void // 播放清晰度
    (e: 'get-play-speed', speed: PlaySpeed): void // 播放速度
    (e: 'get-is-loop', value: boolean): void // 是否循环播放
}>()

// 默认不展开
const localActiveNames = ref<string[]>([])

// 是否显示字幕选择组件
const isShowSubtitleSelect = computed(() => !!props.subtitleStatus?.availableSubtitles)
const availableSubtitles = computed<{ [key: string]: Subtitle }>(() => {
    // 增加一个禁用的选项 ,key：disabled，label：disabled
    if (!props.subtitleStatus) return {}
    return {
        disabled: { label: 'disabled', url: '' },
        ...props.subtitleStatus.availableSubtitles,
    }
})

// 只有一个清晰度选项时不显示
const isShowPlayLevel = computed(() => props.playLevel.allLevels.length > 1)

// 本地状态
const selectedSubtitle = ref(props.subtitleStatus?.selectedSubtitleLanguage)
const selectedPlayLevel = ref(props.playLevel.level)
const selectedPlaySpeed = ref(props.playSpeed)
const isLoop = ref(props.isLoop)

// 处理字幕选择变化
const handleSubtitleChange = (language: string) => {
    selectedSubtitle.value = language
    emit('selected-subtitle-language', language)
}

// 处理播放速度变化
const handlePlaySpeedChange = (speed: PlaySpeed) => {
    selectedPlaySpeed.value = speed
    emit('get-play-speed', speed)
}

// 处理播放清晰度变化
const handlePlayLevelChange = (level: PlayLevelItem) => {
    selectedPlayLevel.value = level as PlayLevelItem
    emit('get-play-level', level)
}

// 处理是否循环播放变化
const handleIsLoopChange = (value: boolean) => {
    isLoop.value = value
    emit('get-is-loop', value)
}

// 保持只展开一个
const handleChange = (activeNames: string[]) => localActiveNames.value = activeNames.length > 0 ? [activeNames[activeNames.length - 1]] : []

// 监控 isShow 的变化,如果 isShow 为 false,则清空选中状态
watch(() => props.isShow, (newVal) => {
    if (!newVal) {
        localActiveNames.value = []
    }
})

</script>

<style scoped lang="scss">
.video-settings {
    width: 100px;
}


.title-content {
    padding-left: 8px;
    color: #333;
}

.el-radio-group {
    display: flex;
    flex-wrap: wrap;
}

.el-radio {
    width: 60px;
    padding-left: 5px;
}

.switch {
    width: 60px;
    padding-left: 5px;
}

// 视频设置折叠面板样式
:deep(.el-collapse) {
    background-color: #eee
}

:deep(.el-collapse,
    .el-collapse-item__wrap) {
    background-color: #eee;
}

:deep(.el-collapse-item__header) {
    background-color: #eee;
}

:deep(.el-collapse-item__content) {
    background-color: #fff;
}
</style>
