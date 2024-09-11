<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-11 16:17:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-11 17:36:31
 * @FilePath     : \blog-client\src\components\player\components\progress-bar\index.vue
 * @Description  : 视频进度条
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <!-- 视频进度条 -->
    <div ref="progressBar" class="progress-bar" @click="onProgressBarClick" @mousemove="onProgressBarMousemove"
        @mouseleave="onProgressBarMouseleave">

        <!-- 缓冲 -->
        <div ref="buffered" class="buffered"></div>

        <!-- 已经播放 -->
        <div ref="played" class="played"></div>

        <!-- 鼠标滑动提示 -->
        <div ref="tooltip" class="tooltip"></div>

        <!-- 滑块 -->
        <div ref="slider" class="slider" @mousedown="handleSliderPointerEvent"
            @touchstart.passive="handleSliderPointerEvent">
        </div>
    </div>

</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { type PlayProgress } from '@/stores/player'
import { formatDurationTime } from '@/utils/dateTime'

defineOptions({ name: 'VideoProgressBar' })

// 定义props
const props = defineProps<{
    playProgress: PlayProgress
}>()


// 定义 emit
const emit = defineEmits<{
    (e: 'seek', time: number): void
}>()


// 定义所有的元素的 ref
const progressBarRef = useTemplateRef<HTMLDivElement | null>("progressBar")
const bufferedRef = useTemplateRef<HTMLDivElement | null>("buffered")
const playedRef = useTemplateRef<HTMLDivElement | null>("played")
const tooltipRef = useTemplateRef<HTMLDivElement | null>("tooltip")
const sliderRef = useTemplateRef<HTMLDivElement | null>("slider")

// 点击进度条
const onProgressBarClick = (e: MouseEvent) => {
    if (progressBarRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const totalWidth = rect.width
        const percent = offsetX / totalWidth
        emit('seek', percent * props.playProgress.duration)
    }
}

// 鼠标移动到进度条上 显示时间提示
const onProgressBarMousemove = (e: MouseEvent) => {
    if (progressBarRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const totalWidth = rect.width
        const percent = offsetX / totalWidth
        const videoTime = percent * props.playProgress.duration

        // 显示时间提示 百分比在 0-1 之间 不然会显示错误结果,特别是在进度条的两端
        if (tooltipRef.value && percent >= 0 && percent <= 1) {
            tooltipRef.value.textContent = formatDurationTime(videoTime)
            tooltipRef.value.style.left = `${offsetX}px`
            tooltipRef.value.style.display = 'block'
        }
    }
}

// 鼠标移出进度条 隐藏时间提示
const onProgressBarMouseleave = () => {
    if (tooltipRef.value) {
        tooltipRef.value.style.display = 'none'
    }
}


// 监听播放进度变化，更新滑块和进度条
watch(() => props.playProgress, (newPlayProgress) => {
    if (progressBarRef.value && playedRef.value && sliderRef.value && bufferedRef.value) {
        const percentProgress = newPlayProgress.currentTime / newPlayProgress.duration
        playedRef.value.style.width = `${percentProgress * 100}%`
        sliderRef.value.style.left = `${percentProgress * 100}%`

        if (newPlayProgress.buffered) {
            const percentBuffered = newPlayProgress.buffered / newPlayProgress.duration
            bufferedRef.value.style.width = `${percentBuffered * 100}%`
        }
    }

},
    // 开启深度监听
    { deep: true }
)


// 拖动滑块是否正在拖动
let isDragging = false

// 处理滑块的指针事件（鼠标和触摸）
const handleSliderPointerEvent = () => {
    isDragging = true
    document.addEventListener('mousemove', onSliderPointerMove)
    document.addEventListener('touchmove', onSliderPointerMove)
    document.addEventListener('mouseup', onSliderPointerUp)
    document.addEventListener('touchend', onSliderPointerUp)
}

// 获取事件的 clientX
const getClientX = (event: MouseEvent | TouchEvent) => {
    if (event.type.startsWith('touch')) {
        return (event as TouchEvent).touches[0].clientX
    } else {
        return (event as MouseEvent).clientX
    }
}

// 滑块指针移动事件
const onSliderPointerMove = (event: MouseEvent | TouchEvent) => {
    if (isDragging && progressBarRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect() // 获取进度条的位置信息
        const offsetX = getClientX(event) - rect.left
        const totalWidth = rect.width
        const percent = Math.max(0, Math.min(offsetX / totalWidth, 1))
        emit('seek', percent * props.playProgress.duration)
    }
}

// 滑块指针抬起事件
const onSliderPointerUp = () => {
    isDragging = false
    document.removeEventListener('mousemove', onSliderPointerMove)
    document.removeEventListener('touchmove', onSliderPointerMove)
    document.removeEventListener('mouseup', onSliderPointerUp)
    document.removeEventListener('touchend', onSliderPointerUp)
}

</script>



<style scoped lang="scss">
.progress-bar {
    position: relative;
    width: 100%;
    height: 10px;
    background: #ccc;
    cursor: pointer;
    margin: 0 10px;
}

.buffered {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #aaa;
    z-index: 1;
}

.played {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: $primary-color;
    z-index: 2;
}

.tooltip {
    position: absolute;
    bottom: 40px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 3px;
    font-size: 12px;
    display: none;
}

.slider {
    position: absolute;
    top: 50%;
    left: 0;
    width: 15px;
    height: 15px;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    cursor: pointer;
}
</style>
