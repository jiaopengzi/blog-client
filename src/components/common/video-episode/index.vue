<!--
 * FilePath    : blog-client\src\components\common\video-episode\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频集数
-->

<template>
    <div class="episode-list">
        <div
            :class="[isPaid ? 'episode-item-paid' : 'episode-item', { 'episode-item-active': isCurrentEpisode(treeMap[i]!) }]"
            v-for="i in treeVideoOrders"
            :key="i"
            @click="handleSelect(treeMap[i]!)"
        >
            <JIcon v-if="isShowLock(isPaid, treeMap[i]?.is_free!)" :name="IconKeys.Lock" :custom-class="`icon-lock`" class="icon" />
            <JIcon v-if="!isShowLock(isPaid, treeMap[i]?.is_free!)" :name="IconKeys.Play" :custom-class="`icon-unlock`" class="icon" />
            <span class="episode-index">{{ orderDisplay(treeMap[i]?.video_order!) }}</span>
            <div class="active-animation" v-if="isCurrentEpisode(treeMap[i]!)"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import JIcon, { IconKeys } from "@/components/common/icons"

import { useVideoTocTree } from "../video-toc-tree-base"
import { type VideoEpisodeProps } from "./types.ts"

defineOptions({ name: "VideoEpisode" })

// 定义 props
const { isPaid, episodeList, currentVideoOrder = 1 } = defineProps<VideoEpisodeProps>()

// 事件
const emit = defineEmits<{
    (event: "video-select", val: PostVideoTocTree): void
}>()

const localTreeList = ref<PostVideoTocTree[]>(episodeList)
const localCurrentVideoOrder = ref<number>(currentVideoOrder)

const treeMap = ref<{ [key: number]: PostVideoTocTree }>({})
const treeVideoOrders = ref<number[]>([])

// hooks
const { videoTotal, covertToMap } = useVideoTocTree(localTreeList)

// 监听 episodeList 变化
watch(
    () => episodeList,
    (newVal) => {
        localTreeList.value = newVal
        const { mapByOrder, videoOrders } = covertToMap(newVal)
        treeMap.value = mapByOrder
        treeVideoOrders.value = videoOrders
    },
    { immediate: true },
)

// 监听 currentVideoOrder 变化
watch(
    () => currentVideoOrder,
    (newVal) => {
        localCurrentVideoOrder.value = newVal
    },
    { immediate: true },
)

const orderDisplay = (order: number) => {
    // 根据总数决定前面补0的位数
    const totalDigits = videoTotal.value ? videoTotal.value.toString().length : 1
    return order.toString().padStart(totalDigits, "0")
}

const handleSelect = (val: PostVideoTocTree) => {
    if (val.video_order === localCurrentVideoOrder.value) {
        return
    }
    localCurrentVideoOrder.value = val.video_order || 1
    emit("video-select", val)
}

// 是否显示锁
const isShowLock = (isPaid: boolean, isFree: boolean) => {
    // 已付费 或 免费 则不显示锁
    return !(isPaid || isFree)
}

// 判断当前视频项是否为当前选中项
const isCurrentEpisode = (item?: PostVideoTocTree) => {
    if (!item) return false
    return item.video_order === localCurrentVideoOrder.value
}
</script>
<style scoped lang="scss">
.episode-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

// 公共样式
%common-episode-item {
    position: relative;
    align-items: center;
    border: 1px solid var(--jpz-border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 20px;
    height: 32px;

    &:hover {
        border-color: var(--jpz-border-color-hover);
        box-shadow: var(--jpz-box-shadow-light);
    }

    .episode-index {
        font-size: 14px;
        color: var(--jpz-text-color-secondary);
        text-align: center;
        width: 100%;
    }
}

.episode-item {
    @extend %common-episode-item;
    padding: 10px 12px 0 12px;

    .icon {
        position: absolute;
        top: 3px;
        left: 2px;
    }

    .icon-lock {
        fill: #c1401f;
        font-size: 12px;
    }

    .icon-unlock {
        fill: #188838;
        font-size: 12px;
    }
}

.episode-item-paid {
    @extend %common-episode-item;
    padding: 8px 12px 2px 12px;

    .icon {
        display: none;
    }
}

.episode-item-active {
    background-color: var(--jpz-bg-color-page);
    border-color: var(--jpz-color-primary);

    .episode-index {
        color: var(--jpz-color-primary);
        font-weight: 600;
        transition: color 0.3s ease;
    }

    // 整体容器的过渡效果
    transition: all 0.3s ease;
}

/* 
参考：https://css-loaders.com/bars/
HTML: <div class="active-animation"></div> 
*/
.active-animation {
    position: absolute;
    top: 3px;
    right: 2px;
    width: 12px;
    height: 12px;
    aspect-ratio: 0.75;
    --c: no-repeat linear-gradient(var(--jpz-text-color-secondary) 0 0);
    background:
        var(--c) 0% 50%,
        var(--c) 50% 50%,
        var(--c) 100% 50%;
    animation: l7 1s infinite linear alternate;
}
@keyframes l7 {
    0% {
        background-size:
            20% 50%,
            20% 50%,
            20% 50%;
    }
    20% {
        background-size:
            20% 20%,
            20% 50%,
            20% 50%;
    }
    40% {
        background-size:
            20% 100%,
            20% 20%,
            20% 50%;
    }
    60% {
        background-size:
            20% 50%,
            20% 100%,
            20% 20%;
    }
    80% {
        background-size:
            20% 50%,
            20% 50%,
            20% 100%;
    }
    100% {
        background-size:
            20% 50%,
            20% 50%,
            20% 50%;
    }
}
</style>
