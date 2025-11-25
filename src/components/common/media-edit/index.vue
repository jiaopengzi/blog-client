<!--
 * @FilePath     : \blog-client\src\components\common\media-edit\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 编辑媒体
-->

<template>
    <div :class="layoutClass">
        <div class="left">
            <MediaShow :hash-id="hashId" :data="mediaShow" :update-subtitles-timestamp="updateSubtitlesTimestamp" />
        </div>

        <div class="middle">
            <MediaInfo :data="mediaInfo" @edit-media-status="handleEditMediaStatus" />
        </div>

        <div class="right" v-if="isVideoFile">
            <SubtitlesInfo
                :file-id="mediaInfo.file_id"
                :hash-id="hashId"
                :subtitles-list="editMediaData.subtitles_language_list"
                @update-subtitles="handleUpdateSubtitles"
                @delete-subtitles="handleDeleteSubtitles"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue"

import { isVideo } from "@/utils/isVideo"

import MediaInfo, { type MediaInfoProps } from "./media-info"
import MediaShow, { type MediaShowProps } from "./media-show"
import SubtitlesInfo from "./subtitles-info"
import type { EditMediaProps } from "./types"

// 定义组件名称
defineOptions({ name: "EditMedia" })

// props
const { editMediaData } = defineProps<{
    editMediaData: EditMediaProps // 编辑媒体数据
}>()

// emits
const emit = defineEmits<{
    (event: "edit-media-status", value: boolean): void // 编辑Media状态
    (event: "update-subtitles", language: string): void // 更新字幕
    (event: "delete-subtitles", language: string): void // 删除字幕
}>()

const handleEditMediaStatus = (value: boolean) => {
    emit("edit-media-status", value)
}

// 更新字幕时间戳
const updateSubtitlesTimestamp = ref(0)

const handleUpdateSubtitles = (value: string) => {
    emit("update-subtitles", value)
    updateSubtitlesTimestamp.value = Date.now()
    emit("edit-media-status", true)
}

const handleDeleteSubtitles = (value: string) => {
    emit("delete-subtitles", value)
    updateSubtitlesTimestamp.value = Date.now()
    emit("edit-media-status", true)
}

const hashId = ref("")

// 表单数据
const mediaInfo = reactive<MediaInfoProps>({} as MediaInfoProps)
const mediaShow = reactive<MediaShowProps>({} as MediaShowProps)

// 是否是视频文件
const isVideoFile = ref(isVideo(editMediaData.file_type))

// 计算属性：根据 isVideoFile 的值设置布局样式
const layoutClass = computed(() => {
    return isVideoFile.value ? "edit-media-page video-layout" : "edit-media-page no-video-layout"
})

// 更新表单数据
const updateForm = (data: EditMediaProps) => {
    isVideoFile.value = isVideo(data.file_type)
    hashId.value = editMediaData.file_name.split(".")[0]!

    // 更新 mediaInfo 数据
    mediaInfo.file_id = data.file_id
    mediaInfo.is_generate_hls = data.is_generate_hls
    mediaInfo.file_name_display = data.file_name_display
    mediaInfo.description = data.description
    mediaInfo.file_id_hash = data.file_id_hash
    mediaInfo.file_url = data.file_url
    mediaInfo.is_free = data.is_free
    mediaInfo.is_video = isVideoFile.value

    // 更新 mediaShow 数据
    // 在 data 的基础上去掉 editDialogVisible 即可
    const rest = { ...data }
    if ("editDialogVisible" in rest) {
        delete (rest as EditMediaProps).editDialogVisible
    }
    Object.assign(mediaShow, rest)
}

// 监控 props.editUserData 变化 更新页面数据
watch(
    () => editMediaData,
    (newVal) => {
        updateForm(newVal) // 更新表单数据
    },
    {
        // 立即执行
        immediate: true,
        deep: true,
    },
)
</script>

<style lang="scss" scoped>
.edit-media-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .left {
        cursor: pointer;
        width: 30%;
    }

    .middle {
        width: 25%;
        position: relative;
        margin: 0 30px;

        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 0;
            width: 1px;
            height: 100%;
            background-color: #ccc;
        }

        &::before {
            left: -15px;
        }

        &::after {
            right: -15px;
        }
    }

    .right {
        width: 45%;

        .multi-btn {
            display: flex;
            flex-wrap: wrap;
        }

        .multi-btn-item {
            margin: 5px;
            width: 80px;
        }
    }
}

// 当没有视频文件时的布局样式
.no-video-layout {
    .left {
        width: 40%;
    }

    .middle {
        width: 60%;
        margin: 0, 20px;

        &::after {
            display: none;
        }
    }
}
</style>
