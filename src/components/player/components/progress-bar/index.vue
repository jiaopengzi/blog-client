<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-11 16:17:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 11:51:54
 * @FilePath     : \blog-client\src\components\player\components\progress-bar\index.vue
 * @Description  : 视频进度条
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <!-- 视频进度条 -->
    <div ref="progressBar" class="progress-bar" @mousedown="onProgressBarClick" @touchstart.passive="onProgressBarClick"
        @mousemove="onProgressBarMousemove" @mouseleave="onProgressBarMouseleave">

        <!-- 缓冲 -->
        <div ref="buffered" class="buffered"></div>

        <!-- 已经播放进度 -->
        <div ref="played" class="played"></div>

        <!-- 鼠标滑动提示 -->
        <div ref="tooltip" class="tooltip"></div>

        <!-- 滑块 -->
        <div ref="slider" class="slider" @mousedown="onSliderDown" @touchstart.passive="onSliderDown"></div>

        <!-- 透明的点击区域 -->
        <div ref="clickAreaRef" class="click-area"></div>
    </div>
</template>

<script setup lang="ts">
import { watch, useTemplateRef, onBeforeUnmount } from 'vue'
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
    (e: 'is-dragging', status: boolean): void
}>()


// 定义所有的元素的 ref
const progressBarRef = useTemplateRef<HTMLDivElement | null>("progressBar")
const bufferedRef = useTemplateRef<HTMLDivElement | null>("buffered")
const playedRef = useTemplateRef<HTMLDivElement | null>("played")
const tooltipRef = useTemplateRef<HTMLDivElement | null>("tooltip")
const sliderRef = useTemplateRef<HTMLDivElement | null>("slider")
const clickAreaRef = useTemplateRef<HTMLDivElement | null>("clickAreaRef")

// 计算1秒步长像素长度
const getStepPixelLength = (totalWidth: number, duration: number) => {
    return totalWidth / duration
}

// 计算当前视频时间和调整后的 offsetX
const getCurrentTimeAndOffsetX = (offsetX: number, totalWidth: number) => {
    const duration = props.playProgress.duration
    const stepPixelLength = getStepPixelLength(totalWidth, duration)
    const currentTime = Math.round(offsetX / stepPixelLength) // round 四舍五入为整数秒
    const adjustedOffsetX = currentTime * stepPixelLength // 调整后的 offsetX
    return { currentTime, adjustedOffsetX }
}

// 标记是否正在拖拽
let isDragging = false

// 添加事件监听器
const addDocumentEventListeners = () => {
    document.addEventListener('mousemove', onSliderPointerMove)
    document.addEventListener('touchmove', onSliderPointerMove)
    document.addEventListener('mouseup', onSliderPointerUp)
    document.addEventListener('touchend', onSliderPointerUp)
}

// 移除事件监听器
const removeDocumentEventListeners = () => {
    document.removeEventListener('mousemove', onSliderPointerMove)
    document.removeEventListener('touchmove', onSliderPointerMove)
    document.removeEventListener('mouseup', onSliderPointerUp)
    document.removeEventListener('touchend', onSliderPointerUp)
}

// 点击进度条
const onProgressBarClick = (e: MouseEvent | TouchEvent) => {
    // 如果正在拖拽，则不处理点击事件
    emit('is-dragging', isDragging)
    if (isDragging) return

    if (progressBarRef.value && sliderRef.value && playedRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect()
        let offsetX = getClientX(e) - rect.left
        const totalWidth = rect.width

        // 限制 offsetX 在 0 和 totalWidth 之间
        offsetX = Math.max(0, Math.min(offsetX, totalWidth))

        const { currentTime, adjustedOffsetX } = getCurrentTimeAndOffsetX(offsetX, totalWidth)

        // 即时响应滑块和已播放进度条位置变化
        updateSliderAndPlayed(offsetX, totalWidth)

        // 添加鼠标抬起事件监听器
        const onMouseUp = () => {
            // 调整滑块和已播放进度条位置到最近的步长位置
            updateSliderAndPlayed(adjustedOffsetX, totalWidth)

            // 如果 currentTime 发生变化，才触发 seek 事件
            if (currentTime !== props.playProgress.currentTime) {
                emit('seek', currentTime)
            }
            removeDocumentEventListeners()
        }

        addDocumentEventListeners()
        document.addEventListener('mouseup', onMouseUp, { once: true })
    }
}

// 显示时间提示
const showTooltip = (offsetX: number, currentTime: number, rect: DOMRect) => {
    // 如果 tooltip 存在且 currentTime 在合理范围内，则显示 tooltip
    if (tooltipRef.value && currentTime >= 0 && currentTime <= props.playProgress.duration) {
        tooltipRef.value.textContent = formatDurationTime(currentTime)
        tooltipRef.value.style.left = `${offsetX}px`
        tooltipRef.value.style.display = 'block'

        // 确保 tooltip 不会溢出屏幕边界
        const tooltipRect = tooltipRef.value.getBoundingClientRect()
        if (tooltipRect.right >= rect.right) {
            // console.log("rect.left", rect)
            // console.log(rect.left)
            tooltipRef.value.style.left = `${rect.right - rect.left - tooltipRect.width}px`
        } else if (tooltipRect.left < 0) {
            tooltipRef.value.style.left = `0px`
        }
    }
}

// 鼠标移动到进度条上 显示时间提示
const onProgressBarMousemove = (e: MouseEvent) => {
    if (progressBarRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const totalWidth = rect.width
        const { currentTime } = getCurrentTimeAndOffsetX(offsetX, totalWidth)

        // 显示时间提示
        showTooltip(offsetX, currentTime, rect)
    }
}

// 鼠标移出进度条 隐藏时间提示
const onProgressBarMouseleave = () => {
    if (!isDragging && tooltipRef.value) {
        emit('is-dragging', isDragging)
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

    // 因为 playProgress 是对象，所以需要深度监听
    { deep: true }
)

// 处理滑块的指针事件（鼠标和触摸）
const onSliderDown = (event: MouseEvent | TouchEvent) => {
    isDragging = true
    emit('is-dragging', isDragging)
    addDocumentEventListeners()
}

// 获取滑块 slider 的 clientX
const getClientX = (event: MouseEvent | TouchEvent) => {
    if (event.type.startsWith('touch')) {
        return (event as TouchEvent).touches[0].clientX
    } else {
        return (event as MouseEvent).clientX
    }
}

// 更新滑块和已播放进度条位置
const updateSliderAndPlayed = (offsetX: number, totalWidth: number) => {
    if (sliderRef.value && playedRef.value) {
        sliderRef.value.style.left = `${(offsetX / totalWidth) * 100}%`
        playedRef.value.style.width = `${(offsetX / totalWidth) * 100}%`
    }
}

// 滑块指针移动事件
const onSliderPointerMove = (event: MouseEvent | TouchEvent) => {
    if (isDragging && progressBarRef.value && sliderRef.value && playedRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect()
        let offsetX = getClientX(event) - rect.left
        const totalWidth = rect.width

        // 修改部分：限制 offsetX 在 0 和 totalWidth 之间
        offsetX = Math.max(0, Math.min(offsetX, totalWidth))

        const { currentTime } = getCurrentTimeAndOffsetX(offsetX, totalWidth)

        // 即时响应滑块和已播放进度条位置变化
        updateSliderAndPlayed(offsetX, totalWidth)

        // 显示时间提示
        showTooltip(offsetX, currentTime, rect)
    }
}

// 滑块指针抬起事件
const onSliderPointerUp = () => {
    isDragging = false
    emit('is-dragging', isDragging)
    removeDocumentEventListeners()

    if (progressBarRef.value && sliderRef.value && playedRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect()
        const totalWidth = rect.width
        let offsetX = sliderRef.value.getBoundingClientRect().left - rect.left

        // 限制 offsetX 在 0 和 totalWidth 之间
        offsetX = Math.max(0, Math.min(offsetX, totalWidth))

        const { currentTime, adjustedOffsetX } = getCurrentTimeAndOffsetX(offsetX, totalWidth)

        // 调整滑块和已播放进度条位置到最近的步长位置
        updateSliderAndPlayed(adjustedOffsetX, totalWidth)

        // 如果 currentTime 发生变化，才触发 seek 事件
        if (currentTime !== props.playProgress.currentTime) {
            emit('seek', currentTime)
        }

        // 隐藏时间提示
        if (tooltipRef.value) {
            tooltipRef.value.style.display = 'none'
        }
    }
}

// 组件销毁时移除事件监听器
onBeforeUnmount(() => {
    removeDocumentEventListeners()
})
</script>

<style scoped lang="scss">
$bar-height: 6px; // 进度条高度

.progress-bar {
    position: relative;
    width: 100%;
    height: $bar-height;
    background: #ccc;
    cursor: pointer;
    border-radius: 3px;

    .buffered {
        position: absolute;
        top: 0;
        left: 0;
        height: $bar-height;
        background: #aaa;
        border-radius: 3px;
        z-index: 1;
    }

    .played {
        position: absolute;
        top: 0;
        left: 0;
        height: $bar-height;
        background: $primary-color;
        border-radius: 3px;
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
        border: 2px solid $primary-color; // 添加外边框

        transition: transform 0.2s ease; // 添加变大动画效果

        // 增大滑块的选中范围
        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 40px; // 增大选中范围
            height: 40px; // 增大选中范围
            transform: translate(-50%, -50%);
            background: transparent;
        }

        &:hover {
            transform: translate(-50%, -50%) scale(1.2); // 鼠标放上去时变大
            cursor: grab; // 鼠标放上去时显示手掌形状
        }

        &:active {
            cursor: grabbing; // 鼠标按下时显示拳头形状
            transform: translate(-50%, -50%) scale(1.0); // 鼠标按下时恢复原来形状
        }
    }

    // 透明的点击区域
    .click-area {
        position: absolute;
        top: -10px;
        left: 0;
        width: 100%;
        height: 26px; // 增大点击区域
        background: transparent;
        z-index: 0; // 确保点击区域在滑块和进度条下方
    }

}
</style>
