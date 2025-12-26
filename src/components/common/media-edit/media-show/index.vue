<!--
 * FilePath    : blog-client-dev\src\components\common\media-edit\media-show\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 媒体展示
-->

<template>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" />
    <div class="show">
        <div class="not-video" @click="handleDelegateClick">
            <img class="view-img" v-if="data.img?.url && !isVideoFile" :src="data.img.url" />
            <j-icon custom-class="view-icon" v-else-if="data.img?.iconKeyName && !isVideoFile" :name="data.img?.iconKeyName" />
        </div>
        <VideoPlayer v-if="isVideoFile" :player-state="playerState" />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import { useVideoWatermark } from "@/components/hooks/useVideoWatermark"
import VideoPlayer from "@/components/player"
import { MediaTypes, type PlayerState, PlayerStateManager } from "@/components/player"
import { isVideo } from "@/utils/isVideo"

import type { MediaShowProps } from "./types"

// 定义组件名称
defineOptions({ name: "EditMedia" })

// props
const { hashId, data, updateSubtitlesTimestamp } = defineProps<{
    hashId: string
    data: MediaShowProps // 编辑媒体数据
    updateSubtitlesTimestamp: number // 更新字幕时间戳
}>()

const playerStateManager = new PlayerStateManager()

// 设置播放器状态
playerStateManager.setShortcutKey(false) // 禁用快捷键
playerStateManager.setIsAdmin(true) // 管理员模式
useVideoWatermark(playerStateManager) // 使用视频水印 hooks

let playerState: PlayerState = playerStateManager.getState()

// 是否是视频文件
const isVideoFile = ref(isVideo(data.file_type))

// 视频宽度
const videoWidth = ref(480)

// 设置播放器
watch(
    () => isVideoFile.value,
    (newVal) => {
        if (newVal) {
            // 设置视频宽度
            playerStateManager.setSize(videoWidth.value, (videoWidth.value * 9) / 16) // 16:9
            playerStateManager.setVideoID(hashId) // 设置视频hashID

            if (!data.is_generate_hls) {
                playerStateManager.setMediaType(MediaTypes.MP4) // 设置视频类型
                playerStateManager.setSrc(data.file_url) // 设置视频地址
            }

            playerState = playerStateManager.getState()
        }
    },
    { immediate: true },
)

// 监听字幕更新
watch(
    () => updateSubtitlesTimestamp,
    () => {
        if (isVideoFile.value) {
            playerStateManager.setSubtitlesByVideoHashIdAuto() // 更新字幕
            playerState = playerStateManager.getState()
        }
    },
)

// 图片预览
const isShowElImageViewer = ref(false)
const imgUrls = ref<string[]>([])

// 关闭图片预览
const closeElImageViewer = () => {
    isShowElImageViewer.value = false
    document.body.style.overflow = "auto"
}

// 点击事件委托,图片预览.
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName.toLowerCase() === "img" && "src" in target) {
        // img 图片
        const imgElement = target as HTMLImageElement // 断言 img 元素
        isShowElImageViewer.value = true // 显示图片预览
        imgUrls.value = [imgElement.src] // 图片地址
        document.body.style.overflow = "hidden" // 隐藏滚动条
    }
}
</script>

<style lang="scss" scoped>
.show {
    display: flex;
    justify-content: center;
    align-items: center;

    .not-video {
        cursor: pointer;

        .view-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .view-icon {
            font-size: 15em;
            fill: var(--jpz-color-primary);
        }
    }
}
</style>
