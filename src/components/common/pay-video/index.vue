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
        <VideoEpisode :is-paid="false" :episode-list="toc!" :current-video-order="currentVideoOrder" @video-select="handleSelect" />
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import VideoPlayer from "@/components/player"
import { fenToYuan } from "@/utils/amount"

import VideoEpisode from "../video-episode"
import VideoTocTreeBase, { type Data } from "../video-toc-tree-base"
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
    state,
    updateVideosIsFree,
    setCurrentVideoProgress,
    switchVideoProgress,
    currentVideoOrder,
} = usePayVideo(localTreeList, localPostId)

// 监听 episodeList 变化
watch(
    () => toc,
    async (newVal) => {
        // if (!(newVal && newVal.length > 0)) return
        // localTreeList.value = newVal
        // const { mapByFileIdHash, mapByOrder, videoOrders, fileIdHashList } = covertToMap(newVal)
        // localMapByFileIdHash.value = mapByFileIdHash
        // localMapByOrder.value = mapByOrder
        // localVideoOrders.value = videoOrders
        // localFileIdHashList.value = fileIdHashList
        // // 更新视频是否免费
        // await updateVideosIsFree()
        // // 设置视频和进度
        // await setCurrentVideoProgress(postId)
    },
)

const handleSelect = (val: Data) => {
    switchVideoProgress(val.file_id_hash)
}
onMounted(async () => {
    if (!(toc && toc.length > 0)) return
    const { mapByFileIdHash, mapByOrder, videoOrders, fileIdHashList } = covertToMap(toc)
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
<style scoped lang="scss"></style>
