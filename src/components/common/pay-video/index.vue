<!--
 * FilePath    : blog-client\src\components\common\pay-video\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费视频
-->

<template>
    <div class="pay-video-container">
        <div class="pay-video-player">
            <VideoPlayer :player-state="state" />
        </div>
        <div class="pay-video-episode" v-if="isShowEpisode">
            <VideoEpisode :is-paid="localIsPaid" :episode-list="toc!" :current-video-order="currentVideoOrder" @video-select="handleSelect" />
        </div>
        <div class="pay-video-toc" v-if="isShowToc">
            <VideoTocTreeDisplay :tree-list="localTreeList" :current-node-key="currentTreeId" @video-select="handleSelect" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import VideoPlayer from "@/components/player"

import VideoEpisode from "../video-episode"
import { type Data } from "../video-toc-tree-base"
import VideoTocTreeDisplay from "../video-toc-tree-display"
import { usePayVideo } from "./hooks"
import { type PayVideoProps } from "./types.ts"

defineOptions({ name: "PayVideo" })

// 定义 props
const { postId, toc, isPaid } = defineProps<PayVideoProps>()
const localPostId = ref<string>(postId)
const localTreeList = ref<PostVideoTocTree[]>(toc || [])
const localIsPaid = ref<boolean>(isPaid)

// hooks
const { isShowEpisode, isShowToc, state, switchVideoProgress, currentVideoOrder, currentTreeId, fetchData } = usePayVideo(localTreeList, localPostId)

// 用户选择视频
const handleSelect = (val: Data) => {
    switchVideoProgress(val.file_id_hash)
}

// 监听 props 变化
watch(
    () => postId,
    (newVal) => {
        localPostId.value = newVal
    },
    { immediate: true },
)

watch(
    () => toc,
    async (newVal) => {
        localTreeList.value = newVal || []

        // 获取数据
        await fetchData()
    },
)

watch(
    () => isPaid,
    (newVal) => {
        localIsPaid.value = newVal
    },
    { immediate: true },
)

onMounted(async () => {
    // 获取数据
    await fetchData()
})
</script>
<style scoped lang="scss">
.pay-video-container {
    width: 100%;
    height: 100%;
    background-color: var(--jpz-bg-color);
    padding: 8px;
    box-sizing: border-box;

    .pay-video-player,
    .pay-video-episode,
    .pay-video-toc {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pay-video-episode {
        padding: 16px;
        box-sizing: border-box;
    }

    .pay-video-toc {
        max-height: 400px;
        overflow: auto;
    }
}
</style>
