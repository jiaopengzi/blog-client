<!--
 * FilePath    : blog-client\src\components\common\pay-video\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费视频
-->

<template>
    <div>
        <VideoTocTreeBase :tree-list="toc" :draggable="false" :show-btns="false" :is-edit="false" @video-select="handleSelect" />
        <VideoPlayer :player-state="state" />
        <VideoEpisode :is-paid="false" :episode-list="toc!" @video-select="handleSelect" />
        <div>文章ID===>：{{ postId }}</div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import VideoPlayer from "@/components/player"
import { Language, MediaTypes, type PlayerState, PlayerStateManager } from "@/components/player"
import { fenToYuan } from "@/utils/amount"

import VideoEpisode from "../video-episode"
import VideoTocTreeBase, { type Data } from "../video-toc-tree-base"
import { useVideoTocTree } from "../video-toc-tree-base"
import { type PayVideoProps } from "./types.ts"

defineOptions({ name: "PayVideo" })

// 定义 props
const { postId, toc } = defineProps<PayVideoProps>()
const localTreeList = ref<PostVideoTocTree[]>(toc || [])

// hooks
const { videoTotal, covertToMap } = useVideoTocTree(localTreeList)
const manager = new PlayerStateManager()

const state = manager.getState()

const treeMap = ref<{ [key: number]: PostVideoTocTree }>({})
const treeVideoOrders = ref<number[]>([])

// 监听 episodeList 变化
watch(
    () => toc,
    (newVal) => {
        const val = newVal || []
        localTreeList.value = val
        const { map, videoOrders } = covertToMap(val)
        treeMap.value = map
        treeVideoOrders.value = videoOrders
        if (videoOrders.length > 0 && videoOrders[0] && treeMap.value && treeMap.value[videoOrders[0]]) {
            manager.setVideoID(treeMap.value[videoOrders[0]]?.video_id || "")
        }
    },
    { immediate: true },
)

const handleSelect = (val: Data) => {
    console.log("选择了视频章节：", val)
}
</script>
<style scoped lang="scss"></style>
