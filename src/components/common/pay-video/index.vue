<!--
 * FilePath    : blog-client\src\components\common\pay-video\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费视频
-->

<template>
    <div class="pay-video-container" v-if="hasVideo">
        <div class="pay-video-player">
            <VideoPlayer :player-state="state">
                <template #toc>
                    <div class="video-toc" v-if="isShowToc && state.isShowToc">
                        <div class="toc-header">
                            <span class="toc-title">视频目录</span>
                            <el-button type="info" text class="close-toc-button" @click="manager.setIsShowToc(false)">关闭目录</el-button>
                        </div>
                        <div class="toc-content">
                            <VideoTocTreeDisplay :tree-list="localTreeList" :current-node-key="currentTreeId" @video-select="handleSelect" />
                        </div>
                    </div>
                </template>
            </VideoPlayer>
        </div>
        <div class="pay-video-episode" v-if="isShowEpisode">
            <VideoEpisode :is-paid="localIsPaid" :episode-list="toc!" :current-video-order="currentVideoOrder" @video-select="handleSelect" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import VideoPlayer from "@/components/player"

import VideoEpisode from "../video-episode"
import { type Data } from "../video-toc-tree-base"
import VideoTocTreeDisplay from "../video-toc-tree-display"
import { usePayVideo } from "./hooks"
import { type PayVideoProps } from "./types.ts"

defineOptions({ name: "PayVideo" })

// 定义 props
const { postId, isAdminVideo = false, toc, isPaid } = defineProps<PayVideoProps>()
const localPostId = ref<string>(postId)
const localIsAdminVideo = ref<boolean>(isAdminVideo)
const localTreeList = ref<PostVideoTocTree[]>(toc || [])
const localIsPaid = ref<boolean>(isPaid)

// hooks
const { isShowEpisode, isShowToc, hasVideo, manager, state, switchVideoProgress, currentVideoOrder, currentTreeId, fetchData, setCurrentVideoProgress } =
    usePayVideo(localTreeList, localPostId, localIsAdminVideo)

const hasInitializedVideoData = ref(false)

// 监听 props 变化
watch(
    () => isAdminVideo,
    (newVal) => {
        localIsAdminVideo.value = newVal
    },
    { immediate: true },
)

watch(
    [() => postId, () => toc],
    async ([newPostId, newToc], [oldPostId, oldToc]) => {
        localPostId.value = newPostId
        localTreeList.value = newToc || []

        const isFirstSync = !hasInitializedVideoData.value
        hasInitializedVideoData.value = true
        const isTocChanged = newToc !== oldToc

        // 首次挂载和目录树变化时统一走完整初始化, 避免 onMounted 与 toc watch 重复取数.
        if (isFirstSync || isTocChanged) {
            await fetchData()
            return
        }

        // 仅文章 ID 变化且目录树未变化时, 只同步当前文章的观看进度, 避免重复请求 is-free.
        if (newPostId && newPostId !== oldPostId && localTreeList.value.length > 0) {
            await setCurrentVideoProgress(newPostId)
        }
    },
    {
        immediate: true,
    },
)

watch(
    () => isPaid,
    (newVal) => {
        localIsPaid.value = newVal
    },
    { immediate: true },
)

// 用户选择视频
const handleSelect = (val: Data) => {
    switchVideoProgress(val.file_id_hash)
    manager.setIsShowToc(false)
}
</script>
<style scoped lang="scss">
.pay-video-container {
    width: 100%;
    height: 100%;
    background-color: var(--jpz-bg-color);
    padding: 8px;
    box-sizing: border-box;

    .pay-video-player,
    .pay-video-episode {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .pay-video-episode {
        padding: 16px;
        box-sizing: border-box;
    }

    .pay-video-player {
        // 相对定位
        position: relative;
        width: 100%;

        .video-toc {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            // border-radius: 8px;
            background-color: color-mix(in srgb, var(--jpz-bg-color) 90%, transparent);
            backdrop-filter: blur(12px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1001;

            .toc-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                border-bottom: 1px solid var(--jpz-border-color);

                .toc-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--jpz-text-color-primary);
                }

                .close-toc-button {
                    margin: 0;
                    color: var(--jpz-text-color-secondary);

                    &:hover {
                        color: var(--jpz-text-color-primary);
                        background-color: var(--jpz-bg-color-overlay);
                    }
                }
            }

            .toc-content {
                flex: 1;
                overflow: auto;
                padding: 0 8px 16px 8px;
            }
        }
    }
}
</style>
