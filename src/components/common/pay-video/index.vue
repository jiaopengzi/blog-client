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
            <VideoPlayer :player-state="state" :key="state.videoID" />
        </div>
        <div class="pay-video-episode" v-if="isShowEpisode">
            <VideoEpisode :is-paid="false" :episode-list="toc!" :current-video-order="currentVideoOrder" @video-select="handleSelect" />
        </div>
        <div class="pay-video-toc" v-if="isShowToc">
            <VideoTocTreeDisplay :tree-list="localTreeList" :current-node-key="currentTreeId" @video-select="handleSelect" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import VideoPlayer from "@/components/player"

import VideoEpisode from "../video-episode"
import { type Data } from "../video-toc-tree-base"
import VideoTocTreeDisplay from "../video-toc-tree-display"
import { usePayVideo } from "./hooks"
import { type PayVideoProps } from "./types.ts"

defineOptions({ name: "PayVideo" })

// 定义 props
const { postId, toc } = defineProps<PayVideoProps>()
const localPostId = ref<string>(postId)
const localTreeList = ref<PostVideoTocTree[]>(toc || [])

// hooks
const {
    localMapByFileIdHash,
    localMapByOrder,
    localVideoOrders,
    localFileIdHashList,
    covertToMap,
    isShowEpisode,
    isShowToc,
    state,
    updateVideosIsFree,
    setCurrentVideoProgress,
    switchVideoProgress,
    currentVideoOrder,
    currentTreeId,
} = usePayVideo(localTreeList, localPostId)

// 用户选择视频
const handleSelect = (val: Data) => {
    switchVideoProgress(val.file_id_hash)
}

onMounted(async () => {
    if (!((toc && toc.length > 0) || !postId)) return

    // 转换为 map 结构
    const { mapByFileIdHash, mapByOrder, videoOrders, fileIdHashList } = covertToMap(localTreeList.value)

    // 设置本地数据
    localMapByFileIdHash.value = mapByFileIdHash
    localMapByOrder.value = mapByOrder
    localVideoOrders.value = videoOrders
    localFileIdHashList.value = fileIdHashList

    // 更新视频是否免费
    await updateVideosIsFree()

    // 设置视频和进度
    await setCurrentVideoProgress(postId)
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
